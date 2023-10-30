# T1-Distribuida

## Sistema
A ideia do sistema desenvolvido é demonstrar como web services podem ser integrados à redes blockchain para adicionar funcionalidades a ela enquanto aplicamos os padrões de desenvolvimento sugeridos pelo professor. No nosso exemplo, simplificado por questões de praticidade, montamos uma pequena blockchain que funcionaria como um aplicativo capaz de registrar a coleção de bolinhas de gude de seus usuários. A rede também inicia um web service que torna um usuário capaz de fazer requisições que serão passadas a nodos participantes da rede que irão propor a transação indicada no request. Além disso, fora da rede blockain existe um web service que atua como um gatekeeper fazendo a verificação do padrão dos request e impedindo que requisições incorretas chegem até a rede blockchain possivelmente a ocupando. Os web services foram produzidos em java script já para a rede blockchain utilizamos uma ferramenta chamada [Minifabric](https://github.com/hyperledger-labs/minifabric) que aplica uma série de scripts que tornam muito mais rápido e prático iniciar uma rede blockchain Hyperledger Fabric. Todas essas tecnologias são executadas em containers docker que se comunicam entre si.

## Iniciando a rede
Montamos o projeto com o intuíto de fazê-lo ser autocontido, por isso ao rodar o script de inicialização da rede será montada e executada uma imagem docker com uma rede hyperledger fabric pelo minifabric modificada para possuir as aplicações que implementamos. Além disso o script também irá inicializar ambos web services.
Para iniciar a rede basta executar o comando ´´´ ./start_network -b ´´´ que tudo deve ser iniciado sem problemas. Caso isso não aconteça é recomendado executar os seguintes passos: 
- ´´´ mkdir -p ~/mywork && cd ~/mywork && curl -o minifab -sL https://tinyurl.com/yxa2q6yr && chmod +x minifab ´´´ comando retirado da documentação do [Minifabric](https://github.com/hyperledger-labs/minifabric).
- Limpar a pasta ~/mywork criada
- Tentar iniciar novamente a rede com ´´´ ./start_network -b ´´´

## Testando a aplicação
Abaixo estão descritos alguns comandos para o teste de execução da rede:

- Adicionando uma nova bolinha de gude
´´´
curl --location --request POST 'http://0.0.0.0:8080/api/gatekeeper/submit' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": {
        "Owner": "Jorge",
        "Color": "Azul",
        "Size": 1
    }
}'
´´´

- Leitura de todas as bolinhas de gude
´´´
curl --location --request POST 'http://0.0.0.0:8080/api/gatekeeper/read/getAllMarbles'
´´´

- Leitura de uma bolinha de gude específica
´´´
curl --location --request POST 'http://0.0.0.0:8080/api/gatekeeper/read/getMarble' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": {
        "Owner": "a",
        "Color": "b"
    }
}'
´´´

Também é possível, já que rodamos tudo localmente, verificar as bolinhas de gude diretamente na rede blockchain, para isto é necessário acessar a pasta '~/mywork' e executar o comando ´´´ ./minifab query -p '"GetAllMarbles"' ´´´