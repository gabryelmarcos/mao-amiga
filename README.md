
INSTALAÇÃO DE DEPENDENCIAS 
npm i

Rodar codigo : npx expo start

autenticação do app: login com email e senha (realizar um cadastro)

Navegação

1 - por icones atraves da barra de navegação
2 - drawer, puxando o canto esquero da tela

Funções do APP

1 - se inscrever em um evento
2 - criar um novo Evento
3 - Verificar inscrições (Opções disponivel no drawer)
4 - aceitar pedidos de ingressantes (Opção disponivel no drawer)

obs: apenas o proprietario da vaga pode aceitar os pedidos, para verificar a funcionalidade, pode se inscrever em um evento que foi criado por você, não é necessario trocar de conta

principais componentes e suas localizações

components > EventListitem

App > [id]

App > (auth) login e register

App > (Drawer) >  MyEvents e WaitingList

App > (Drawer) > (Tabs) > index, newEvent, 
