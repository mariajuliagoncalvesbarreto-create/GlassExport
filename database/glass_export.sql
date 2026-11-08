
CREATE DATABASE glass_export;

USE glass_export;

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    custo DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0
);

CREATE TABLE moedas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pais VARCHAR(100) NOT NULL,
    codigo VARCHAR(3) NOT NULL,
    cotacao DECIMAL(10,4) NOT NULL
);

INSERT INTO produtos (nome, descricao, custo, estoque)
VALUES
('Copo Elegance', 'Copo de vidro premium', 10.00, 500),
('Copo Crystal', 'Copo de vidro cristalino', 15.00, 300),
('Copo Classic', 'Copo tradicional de vidro', 8.00, 800);

INSERT INTO moedas (pais, codigo, cotacao)
VALUES
('Estados Unidos', 'USD', 5.00),
('Europa', 'EUR', 5.80),
('Reino Unido', 'GBP', 6.70);
