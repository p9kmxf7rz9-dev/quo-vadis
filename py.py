import mysql.connector

DB_CONFIG={
    "host":"localhost",
    "user":"root",
    "password":"#3Ags0x4",
    "database":"quo_vadis",
    "port":3306
}

def conectar():
    return mysql.connector.connect(**DB_CONFIG)

def cadastrar_pessoa(nome,whatsapp):
    conn=conectar()
    cursor=conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO pessoas (nome,whatsapp,consentimento) VALUES (%s,%s,TRUE)",
            (nome,whatsapp)
        )
        conn.commit()
        return True
    except mysql.connector.IntegrityError:
        conn.rollback()
        return False
    finally:
        cursor.close()
        conn.close()

def buscar_pendentes(artigo_slug):
    conn=conectar()
    cursor=conn.cursor()

    cursor.execute(
        """
        SELECT p.id,p.nome,p.whatsapp
        FROM pessoas p
        WHERE p.ativo=TRUE
        AND p.consentimento=TRUE
        AND p.id NOT IN(
            SELECT n.pessoa_id
            FROM notificacoes_enviadas n
            WHERE n.artigo_slug=%s
            AND n.status='sucesso'
        )
        """,
        (artigo_slug,)
    )

    resultado=cursor.fetchall()
    cursor.close()
    conn.close()
    return resultado

def registrar_envio(pessoa_id,artigo_slug,status):
    conn=conectar()
    cursor=conn.cursor()

    cursor.execute(
        """
        INSERT INTO notificacoes_enviadas
        (pessoa_id,artigo_slug,status)
        VALUES(%s,%s,%s)
        """,
        (pessoa_id,artigo_slug,status)
    )

    conn.commit()
    cursor.close()
    conn.close()

def enviar_whatsapp(whatsapp,mensagem):
    print(f"[SIMULADO] Enviando para {whatsapp}: {mensagem}")
    return True

if __name__=="__main__":
    slug_do_artigo="artigo-teste"
    link_do_artigo="https://seusite.com/pages/articles/artigo-teste.html"

    pendentes=buscar_pendentes(slug_do_artigo)

    print(f"{len(pendentes)} pessoa(s) pendente(s)")

    for pessoa_id,nome,whatsapp in pendentes:
        mensagem=f"Olá, {nome}! Publicamos um novo artigo: {link_do_artigo}"

        sucesso=enviar_whatsapp(whatsapp,mensagem)

        registrar_envio(
            pessoa_id,
            slug_do_artigo,
            "sucesso" if sucesso else "falha"
        )

    print("Processo concluído.")