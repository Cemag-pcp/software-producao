from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import gspread
import warnings
import pandas as pd
import cachetools
from cachetools import Cache
import psycopg2  # pip install psycopg2
import psycopg2.extras

DB_HOST = "database-1.cdcogkfzajf0.us-east-1.rds.amazonaws.com"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "15512332"

warnings.filterwarnings("ignore")

filename = "service_account.json"

app = Flask(__name__)
app.secret_key = 'software_producao'  

cache_carretas = cachetools.LRUCache(maxsize=128)
cache_base_carretas_explodidas = cachetools.LRUCache(maxsize=128)


def resetar_cache(cache):

    """
    Função para limpar caches (não precisar fazer
    requisição sempre que atualizar a página).
    """
    cache.clear()


def formatar_data(data):
    return data.strftime("%d/%m/%Y") if data else ''


@app.route("/visualizar-pecas-solicitadas")
def visualizar_pecas_solicitadas():

    """
    Rota para visualizar peças que foram solicitadas ao setor de Estamparia/Corte
    A peças deverão conter a coluna de status "null", pois quer dizer que elas não
    Base utilizada: software_producao.tb_solicitacao_pecas
    """

    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                                password=DB_PASS, host=DB_HOST)
    cur = conn.cursor()

    sql = """
    SELECT * FROM software_producao.tb_solicitacao_pecas WHERE status ISNULL
    """

    cur.execute(sql)

    data = cur.fetchall()

    data = [(tupla[0], formatar_data(tupla[1]), *tupla[2:]) for tupla in data]
    
    return jsonify(data)


# @cachetools.cached(cache_base_carretas_explodidas)
@app.route("/api/base_carretas")
def base_carretas():

    """
    API para buscar tabela de carretas explodidas.
    Base: pcp.tb_base_carretas_explodidas
    """

    page = request.args.get('page', type=int)
    per_page = request.args.get('per_page', type=int)
    peca = request.args.get('peca')
    processo = request.args.get('processo')
    carreta = request.args.get('carreta')
    conjunto = request.args.get('conjunto')

    # Calcule o deslocamento com base no número da página e itens por página
    offset = (page - 1) * per_page

    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Construa a consulta SQL com base nos parâmetros de filtro
    sql = """
        SELECT * FROM pcp.tb_base_carretas_explodidas
        WHERE 1=1
    """
    
    if peca:
        sql += f" AND codigo = '{peca}'"
    if processo:
        sql += f" AND processo = '{processo}'"
    if carreta:
        sql += f" AND carreta = '{carreta}'"
    if conjunto:
        sql += f" AND conjunto = '{conjunto}'"
        

    # Adicione a cláusula de limite e deslocamento para paginação
    sql += f" LIMIT {per_page} OFFSET {offset}"

    print(sql)

    cur.execute(sql)
    data = cur.fetchall()

    return data


@app.route("/solicitar-peca", methods=['POST'])
def solicitar_peca():

    """
    Rota para receber a solicitação de peças e registrar no banco de dados.
    Recebe um json e insere no banco de dados.
    Base: software_producao.tb_solicitacao_pecas
    data_json: json com registros.
    """

    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                                password=DB_PASS, host=DB_HOST)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    data_json = request.get_json()

    codigo = data_json['codigo']
    carreta = data_json['carreta']
    quantidade = data_json['quantidadeSolicitada']
    descricao = data_json['descricao']
    conjunto = data_json['conjunto']
    observacao = data_json['observacao']

    print(data_json)

    sql = """
        INSERT INTO software_producao.tb_solicitacao_pecas (carreta,codigo,quantidade,descricao,conjunto,observacao) values ('{}','{}',{},'{}','{}','{}')
    """.format(carreta, codigo, quantidade, descricao, conjunto, observacao)

    cur.execute(sql)

    conn.commit()
    conn.close()

    return data_json


@cachetools.cached(cache_carretas)
def buscar_dados(filename):

    """
    Função para acessar google sheets via api e
    buscar dados da base de carretas.
    """

    sheet_id = '1olnMhK7OI6W0eJ-dvsi3Lku5eCYqlpzTGJfh1Q7Pv9I'
    worksheet1 = 'Importar Dados'

    sa = gspread.service_account(filename)
    sh = sa.open_by_key(sheet_id)

    wks1 = sh.worksheet(worksheet1)

    headers = wks1.row_values(1)

    base = wks1.get()
    base = pd.DataFrame(base)
    # base = base.iloc[:,:23]
    base_carretas = base.set_axis(headers, axis=1)[1:]
    base_carretas['PED_PREVISAOEMISSAODOC'] = pd.to_datetime(base_carretas['PED_PREVISAOEMISSAODOC'], format="%d/%M/%Y", errors='ignore')

    return base_carretas


@app.route("//<username>")
def tela_inicial(username):

    """
    Rota para tela inicial, faz chamada a função de (buscar_dados) e 
    devolve a tabela com as carretas e suas datas.

    :username: Nome do setor logado, essa variável vem da rota /login
    """

    base_carretas = buscar_dados(filename)
    base_carretas_dataframe = base_carretas
    base_carretas = base_carretas.values.tolist()
    
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                                password=DB_PASS, host=DB_HOST)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    sql = """SELECT * FROM software_producao.tb_programacao_checked WHERE checkbox = 'true'"""

    cur.execute(sql)
    data = cur.fetchall()
    dataFrame = pd.DataFrame(data)

    dataFrame['chave'] = dataFrame['chave'].apply(add_slash)

    dataFrame.merge(base_carretas_dataframe, how='left', right_on='PED_NUMEROSERIE', left_on='chave')



    return render_template("tela-inicial.html", base_carretas=base_carretas, username=username)


@app.route("/receber-checkbox", methods=['POST'])
def receber_checkbox():

    """
    Rota para receber a ação de marcar ou desmarcar o checkbox.
    Se o usuário marcou pela primeira vez, a função adiciona ao banco,
    caso o usuário ja tenha marcado e está desmarcando, a função apenas edita no banco.

    Banco utilizado: software_producao.tb_programacao_checked
    """

    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                            password=DB_PASS, host=DB_HOST)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    data_json = request.get_json()
    print(data_json)

    data_json = pd.DataFrame(data_json)

    print(data_json)

    data_list_insert_sql = data_json.values.tolist()

    """Verificação se ja existe esse checkbox"""
    
    chave = data_json['chave'][0]
    setor = data_json['setor'][0]

    sql = """
            SELECT chave 
            FROM software_producao.tb_programacao_checked
            WHERE chave = '{}' and setor = '{}'
        """.format(chave, setor)
    
    cur.execute(sql)
    data = cur.fetchall()

    if len(data) > 0:

        for state, conjunto in zip(data_json['state'].values.tolist(), data_json['conjunto'].values.tolist()):
            
            sql = """
                SELECT *
                FROM software_producao.tb_programacao_checked
                WHERE chave = '{}' and setor = '{}' and conjunto = '{}';
                """.format(chave, setor, conjunto) 

            cur.execute(sql)
            verificacao_conjunto_existente = cur.fetchall()

            if len(verificacao_conjunto_existente) > 0:


                sql = """
                    UPDATE software_producao.tb_programacao_checked
                    SET checkbox = '{}'
                    WHERE chave = '{}' and setor = '{}' and conjunto = '{}';
                    """.format(state, chave, setor, conjunto)
                
                cur.execute(sql)

            else:

                sql = """
                INSERT INTO software_producao.tb_programacao_checked (chave, setor, conjunto, checkbox)
                VALUES ('{}','{}','{}','{}');
                """.format(chave, setor, conjunto, state)
            
                cur.execute(sql)
            
            
        conn.commit()
        conn.close()

    else:
        sql = """
            INSERT INTO software_producao.tb_programacao_checked (chave, setor, conjunto, checkbox)
            VALUES (%s, %s, %s, %s)
        """

        cur.executemany(sql, data_list_insert_sql)

        conn.commit()

        conn.close()

    return 'sucess'


@app.route("/resgatar-checkbox/<chave>", methods=['GET'])
def resgatar_checkbox(chave):

    """
    Rota para atualizar a tela-inicial.html com checkbox ja existentes.
    A função busca no banco software_producao.tb_programacao_checked.
    """

    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                            password=DB_PASS, host=DB_HOST)
    cur = conn.cursor()

    print(chave)

    cur.execute("SELECT conjunto,checkbox FROM software_producao.tb_programacao_checked WHERE chave = '{}'".format(chave))
    dados = cur.fetchall()

    dados = [[conjunto[0], conjunto[1]] for conjunto in dados]
    
    return jsonify(dados)


@app.route("/login", methods=["GET", "POST"])
def login():
    
    """
    Rota para login.
    Busca na tabela software_producao.tb_usuario se o usuario e a senha estão corretas.
    """

    if request.method == "POST":

        resetar_cache(cache_carretas)

        conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                            password=DB_PASS, host=DB_HOST)
        cur = conn.cursor() 
        
        # Obtenha os dados do formulário (substitua 'username' e 'password' pelos campos do formulário)
        username = request.form.get("username")
        password = request.form.get("password")

        cur.execute("SELECT * FROM software_producao.tb_usuario WHERE usuario = '{}' and senha = '{}'".format(username, password))

        data = cur.fetchall()

        if len(data) > 0:
            # Autenticação bem-sucedida, redirecione para a página de boas-vindas
            return redirect(url_for("tela_inicial",username=username))
        else:
            # Credenciais inválidas, exiba uma mensagem de erro
            flash("Credenciais inválidas. Tente novamente.", "error")
    
    return render_template("login.html")


@app.route("/peca-concluida", methods=['POST'])
def peca_concluida():

    """
    Rota para alterar status da peça solicitada.
    Usuário clica em Ok e é enviada uma requisição ao banco de dados.
    Base: software_producao.tb_solicitacao_pecas
    """

    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                            password=DB_PASS, host=DB_HOST)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    data = request.get_json()
    print(data)

    sql = f"""
        UPDATE software_producao.tb_solicitacao_pecas
        SET status = 'true'
        WHERE id = {data['chave']}
    """

    cur.execute(sql)

    conn.commit()
    conn.close()

    return data

@app.route("/carretas-checked")
def carretas_checked():

    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                            password=DB_PASS, host=DB_HOST)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    sql = """
    SELECT * FROM software_producao.tb_programacao_checked
    """

    cur.execute(sql)

    carretas_checked = cur.fetchall()
    carretas_checked = pd.DataFrame(carretas_checked)
    carretas_checked['chave'] = carretas_checked['chave'].apply(add_slash)


    carretas_planilha = buscar_dados(filename)

    return 'sucess'


def add_slash(s):
    """
    Função para adicionar uma "/" na posição -4 de cada chave
    """

    if len(s) >= 4:
        return s[:-4] + '/' + s[-4:]
    else:
        return s
    

@app.route("/visao-geral")
def visao_geral():

    base_carretas = buscar_dados(filename)
    base_carretas = base_carretas.values.tolist()

    return render_template("visao-geral.html", base_carretas=base_carretas)


if __name__ == '__main__':
    app.run()