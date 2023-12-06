from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, send_file
import gspread
import warnings
import pandas as pd
import cachetools
from cachetools import Cache
import os
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

@app.route("/visualizacao-peca-concluida", methods=['GET'])
def visualizar_pecas_concluidas():

    """
    Rota para visualizar peças que foram concluidas ao setor de Estamparia/Corte
    A peças deverão conter a coluna de status "true"
    Base utilizada: software_producao.tb_solicitacao_pecas
    """

    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                                password=DB_PASS, host=DB_HOST)
    cur = conn.cursor()

    sql = """
        SELECT * 
        FROM software_producao.tb_solicitacao_pecas 
        WHERE status = 'true' ORDER BY id;
    """

    cur.execute(sql)

    data = cur.fetchall()

    data = [(tupla[0], formatar_data(tupla[1]), *tupla[2:]) for tupla in data]
    
    return jsonify(data)


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
    SELECT * FROM software_producao.tb_solicitacao_pecas WHERE status ISNULL ORDER BY id
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

    processo = data_json['processo']
    codigo = data_json['codigo']
    carreta = data_json['carreta']
    quantidade = float(data_json['quantidadeSolicitada'])
    quantidadeEstoque = data_json['quantidadeEstoque']
    descricao = data_json['descricao']
    conjunto = data_json['conjunto']
    observacao = data_json['observacao']
    origem = data_json['origem']
    dadosTabela = data_json['dadosTabela']

    dataFrame = pd.DataFrame(dadosTabela)

    dataFrame_filtrado = dataFrame.loc[dataFrame[1] == carreta]

    print(dataFrame_filtrado)

    data_carreta = dataFrame_filtrado[0].str.cat(sep='-')

    if quantidadeEstoque != '':
        quantidadeEstoque = float(quantidadeEstoque) 
        quantidade = quantidade - quantidadeEstoque

    sql = """
        INSERT INTO software_producao.tb_solicitacao_pecas (carreta,codigo,quantidade,descricao,conjunto,observacao,origem,processo,data_carreta) values ('{}','{}',{},'{}','{}','{}','{}','{}','{}')
    """.format(carreta, codigo, quantidade, descricao, conjunto, observacao,origem,processo,data_carreta)

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
    base_carretas[base_carretas['PED_RECURSO.CODIGO'] == 'F4 CS RS/RS A45 P750(I) M23']

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
    base_carretas_filtro = list(set(row[10] for row in base_carretas if row[10] is not None and row[10] != ""))
    
    
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                                password=DB_PASS, host=DB_HOST)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    sql = """SELECT * FROM software_producao.tb_programacao_checked WHERE checkbox = 'true'"""

    cur.execute(sql)
    data = cur.fetchall()
    dataFrame = pd.DataFrame(data)

    dataFrame['chave'] = dataFrame['chave'].apply(add_slash)

    dataFrame.merge(base_carretas_dataframe, how='left', right_on='PED_NUMEROSERIE', left_on='chave')

    # Pode ser necessário realizar alguma lógica adicional com os dados recebidos

    df = pd.DataFrame(base_carretas)

    # Lista de colunas desejadas
    colunas_desejadas = [6, 10, 13, 15]

    # Certifique-se de que as colunas existem antes de filtrar
    colunas_existentes = set(df.columns)
    colunas_para_filtrar = [coluna for coluna in colunas_desejadas if coluna in colunas_existentes]

    # Crie o DataFrame apenas com as colunas desejadas
    df = df[colunas_para_filtrar]

    # Lista de sufixos a serem removidos
    sufixos_para_remover = ['VM', 'VJ', 'AV', 'CO', 'LC', 'AN']

    # Remove os sufixos das colunas específicas
    for coluna in colunas_para_filtrar:
        for sufixo in sufixos_para_remover:
            df[coluna] = df[coluna].str.rstrip(sufixo)

    # Renomear as colunas
    df = df.rename(columns={6: 'data', 10: 'carreta', 13: 'chave', 15: 'quantidade'})

    # Filtrar linhas onde a coluna 'carreta' não começa com dígitos
    df = df[~df['carreta'].astype(str).str.match(r'^\d')]

    # Converta a coluna 'quantidade' para tipo numérico
    df['quantidade'] = pd.to_numeric(df['quantidade'], errors='coerce')
    df['carreta'] = df['carreta'].str.strip()

    # Remover linhas onde todos os valores são vazios ou nulos
    df = df.dropna(how='any')

    # Agrupa por 'carreta' e soma as colunas 'quantidade', 'data' e 'chave'
    base_levantamento = df.groupby(['data', 'carreta'])['quantidade'].sum().reset_index()
    
    query = """SELECT DISTINCT carreta FROM pcp.tb_base_carretas_explodidas"""

    cur.execute(query)
    data = cur.fetchall()
    base_explodidas = pd.DataFrame(data)

    # Verifica se a carreta de base_levantamento está presente em dataFrame
    base_levantamento['innovaro'] = base_levantamento['carreta'].isin(base_explodidas['carreta'])

    base_levantamento = base_levantamento.values.tolist()

    return render_template("tela-inicial.html", base_carretas=base_carretas, username=username,base_carretas_filtro=base_carretas_filtro,base_levantamento=base_levantamento)

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

    data_json = pd.DataFrame(data_json)

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

@app.route("/", methods=["GET", "POST"])
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


@app.route("/get_base_carretas", methods=['POST'])
def get_base_carretas():

    try:
        # Obtenha os dados JSON da requisição
        data = request.json
         # data = {'carretas': ['CBH6R FO SS T P750(I) M21', 'F6 SS RS/RS A45 P750(I) M23', '026020', 'F6 CS RS/RS A45 P750(I) M23', 'CBHM10000-2E SS RS/RD P750(I) M17', 'CBH6-2E FO SS RS/RD P750(I) M21', 'FTC6500 CS RS/RS BB P750(I) M22', 'FTC6500 CS RS/RS BB P750(I) M22 AV', '026054', '030671', 'CBHM5000 GR SS RD MM P750(I) M17 AV', 'CBHM6000 CA SS RD MM M21 AN', 'CBHM5000 CA SC RD ABA MM P750(I) M17 VJ', '466657CO', 'CBH5 FO SS T MM P750(I) M21 AV', 'CBH6 FO SS T MM P750(I) M22 AV', 'CBH6 FO SS T MM P750(I) M22 VM', 'CBHM5000 CA SS RD ABA MM P750(I) M17 VM', 'CBHM6000 CA SS RD ABA MM P750(I) M21 VM', 'CBHM6000 CA SC RD ABA MM P750(I) M21 VJ', 'CBH5 UG SS RD P750(I) M21', 'FTC4300 SS RS/RS BB P750(I) M22 AN', 'CBHM5000 GR SS RD MM M17 VM', 'CBHM5000 GR SS T MM M20', 'CBHM5000 GR SS RD MM M17', '318280', '318413', '031254LC', '240590', '222185', '240229']}
 
        # Acesse o array de objetos 'data' dentro do objeto JSON
        data_list = data.get('data', [])

        # Crie um DataFrame a partir dos dados
        df = pd.DataFrame(data_list)

        df = df[~df['carreta'].astype(str).str.match(r'^\d')]

        # Lista de sufixos a serem removidos
        sufixos_para_remover = ['VM', 'VJ', 'AV', 'CO', 'LC', 'AN']

        # Remove os sufixos da coluna 'carreta'
        for sufixo in sufixos_para_remover:
            df['carreta'] = df['carreta'].str.rstrip(sufixo)

        # Converta a coluna 'quantidade' para tipo numérico
        df['quantidade_carretas'] = pd.to_numeric(df['quantidade_carretas'])

        # Agrupa por 'carreta' e soma a coluna 'quantidade_carretas'
        df_agrupado = df.groupby('carreta')['quantidade_carretas'].sum().reset_index()

        lista_carretas = df_agrupado['carreta'].values.tolist()
    
        lista_carretas = tuple(lista_carretas)

        conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                            password=DB_PASS, host=DB_HOST)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = f"""
        SELECT processo, conjunto, codigo, descricao, quantidade, carreta FROM pcp.tb_base_carretas_explodidas WHERE carreta in {lista_carretas}
        """

        cur.execute(sql)
        tabela_filtrada = cur.fetchall()
        df_tabela_filtrada = pd.DataFrame(tabela_filtrada)

        df_combinado = pd.merge(df_tabela_filtrada, df_agrupado, how='inner', on='carreta')

        # Crie a nova coluna 'quantidade_total' multiplicando as colunas 'quantidade_carretas' e 'quantidade'
        df_combinado['Quantidade'] = df_combinado['quantidade_carretas'] * df_combinado['quantidade']

        df_combinado['Observacao'] = ''  # Coluna para o textarea
        df_combinado['Solicitar'] = ''
        df_combinado['Quantidade no Estoque'] = ''  # Coluna para o botão

        df_combinado_html = df_combinado[['processo', 'conjunto', 'codigo','descricao', 'carreta', 'Quantidade','Quantidade no Estoque','Observacao', 'Solicitar']].to_html(index=False)

        # Adicionar a classe 'responsive-table' à tabela
        df_combinado_html = df_combinado_html.replace('<table border="1" class="dataframe">', '<table border="0" class="responsive-table responsive" id="responsive">')

        # Adicionar a classe 'cabecalho' às células do cabeçalho ('th')
        df_combinado_html = df_combinado_html.replace('<th>', '<th class="cabecalho">')

        # Separar o cabeçalho e o corpo do HTML
        thead_end_index = df_combinado_html.find('</thead>')
        thead_html = df_combinado_html[:thead_end_index]
        tbody_html = df_combinado_html[thead_end_index:]

        # Adicionar colunas extras no final de cada linha no corpo do HTML
        tbody_html = tbody_html.replace('</tr>', '<td data-label="Quantidade no Estoque"><input type="number" class="form-control2"></td><td data-label="Observação"><textarea class="form-control-textarea"></textarea></td><td><button class="solicitar" id="solicitar_levantamento">Solicitar</button></td></tr>')
        
        # Juntar o cabeçalho e o corpo do HTML
        df_combinado_html = thead_html + tbody_html
        
        df_combinado_html = df_combinado_html.replace('<td></td>', '')

        # Você pode retornar uma mensagem de sucesso ou qualquer outra coisa que desejar
        return jsonify({'message': 'Dados recebidos com sucesso!','df_combinado_html': df_combinado_html})

    except Exception as e:
        # Em caso de erro, retorne uma resposta de erro
        return jsonify({'error': str(e)}), 500


@app.route('/download-modelo-atividades', methods=['GET'])
def download_modelo_excel():
    # Caminho para o arquivo modelo CSV
    excel_filename = 'Modelo_Base_Innovaro.csv'

    # Envie o arquivo para download
    return send_file(excel_filename, as_attachment=True, mimetype='text/csv')


@app.route('/receber-upload', methods=['POST'])
def receber_upload():

    # Obter o arquivo do formulário
    file = request.files['file']

    try:
        df = pd.read_csv(file, sep=";", encoding='ISO-8859-1')
    except :
        df = pd.read_excel(file)

         # Colunas esperadas no modelo
    colunas_esperadas = ['processo', 'conjunto', 'codigo','descricao','materia_prima','comprimento','largura','quantidade','etapa_seguinte','carreta']  # Substitua com as colunas reais

    # Verificar se as colunas do DataFrame coincidem com as colunas esperadas
    if set(df.columns) != set(colunas_esperadas):
        return 'Colunas do arquivo não correspondem ao modelo'

    carretas_unicas = df['carreta'].unique()
        
     # Verificar carretas que não existem no banco de dados
    carretas_nao_existentes = [carreta for carreta in carretas_unicas if carreta not in consulta_carretas_existem(carreta)]

    # Inserir linhas para carretas que não existem
    for carreta_nova in carretas_nao_existentes:
        linhas_novas = df[df['carreta'] == carreta_nova]
        print(linhas_novas)
        inserir_linhas_no_banco(linhas_novas)

    return 'success'

def consulta_carretas_existem(carreta):

    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                            password=DB_PASS, host=DB_HOST)

    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    sql = f"SELECT carreta FROM pcp.tb_base_carretas_explodidas WHERE carreta = '{carreta}'"
    cur.execute(sql)
    carretas_existem = [row['carreta'] for row in cur.fetchall()]

    return carretas_existem

def inserir_linhas_no_banco(linhas):
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                            password=DB_PASS, host=DB_HOST)

    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    for _, linha in linhas.iterrows():

        print(linha['processo'],linha['conjunto'],linha['codigo'],linha['descricao'],linha['materia_prima'],linha['comprimento'],linha['largura'],linha['quantidade'],linha['etapa_seguinte'],linha['carreta'])
        sql = f"""
            INSERT INTO pcp.tb_base_carretas_explodidas
            (processo, conjunto, codigo, descricao, materia_prima, comprimento, largura, quantidade, etapa_seguinte, carreta)
            VALUES ('{linha['processo']}', '{linha['conjunto']}', '{linha['codigo']}', '{linha['descricao']}',
                    '{linha['materia_prima']}', {linha['comprimento']}, {linha['largura']}, {linha['quantidade']},
                    '{linha['etapa_seguinte']}', '{linha['carreta']}')
        """
        cur.execute(sql)
        conn.commit()


if __name__ == '__main__':
    app.run()