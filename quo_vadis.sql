CREATE DATABASE IF NOT EXISTS quo_vadis;
USE quo_vadis;

CREATE TABLE pessoas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(14) NOT NULL UNIQUE,
    consentimento BOOLEAN NOT NULL DEFAULT FALSE,
    data_consentimento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notificacoes_enviadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pessoa_id INT NOT NULL,
    artigo_slug VARCHAR(150) NOT NULL,
    enviado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('sucesso', 'falha') NOT NULL,
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id)
);

INSERT INTO pessoas (nome, whatsapp, consentimento)
VALUES ('Arthur', '51998643228', TRUE);

SELECT * from notificacoes_enviadas;

SELECT p.id, p.nome, p.whatsapp
FROM pessoas p
WHERE p.ativo = TRUE
  AND p.id NOT IN (
      SELECT n.pessoa_id
      FROM notificacoes_enviadas n
      WHERE n.artigo_slug = 'artigo-teste'
        AND n.status = 'sucesso'
  );

INSERT INTO notificacoes_enviadas (pessoa_id, artigo_slug, status)
VALUES (%s, %s, 'sucesso');

INSERT INTO notificacoes_enviadas (pessoa_id, artigo_slug, status)
VALUES (%s, %s, 'falha');

UPDATE pessoas
SET ativo = FALSE
WHERE whatsapp = %s;