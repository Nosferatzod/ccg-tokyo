<template>
  <div id="app">
    <video autoplay muted loop class="video-background">
      <source src="@/assets/video/cyberpunk.mp4" type="video/mp4" />
      Seu navegador não suporta o formato de vídeo.
    </video>

    <div class="content">
      <h1>Tarefas Banco de Dados</h1>

      <!-- Tela de Cadastro de Usuário -->
      <div class="register-container">
        <h2>Cadastro de Usuário</h2>
        
        <label>Email:</label>
        <input type="email" v-model="email" placeholder="Digite seu email" />
        <br />

        <label>Senha:</label>
        <input type="password" v-model="senha" placeholder="Digite sua senha" />
        <br />

        <button @click="cadastrarUsuario">Cadastrar Usuário</button>
      </div>

      <hr />

      <label>Tarefa: </label> 
      <input type="text" v-model="tarefa">
      <br>

      <label>Autor: </label> 
      <input type="text" v-model="autor">
      <br>

      <button @click="cadastrar">Cadastrar Tarefa</button>
      <button @click="buscarPosts">Buscar Posts</button>

      <hr>

      <div v-if="posts.length > 0">
        <h2>Posts Cadastrados:</h2>
        <ul class="post-list">
          <li v-for="post in posts" :key="post.id">
            <strong>ID:</strong> {{ post.id }} <br>
            <strong>Tarefa:</strong> 
            <input type="text" v-model="post.tarefa" />
            <br>
            <strong>Autor:</strong> 
            <input type="text" v-model="post.autor" />
            <br>

            <!-- Botão de Atualizar -->
            <button @click="atualizarPost(post)">Atualizar</button>

            <!-- Botão de Excluir -->
            <button @click="excluirPost(post.id)">Excluir</button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Não há posts cadastrados.</p>
      </div>
    </div>
  </div>
</template>

<script>
// Importando o Firebase Authentication e Firestore
import { db, auth } from './services/firebaseConnection.js';

export default {
  name: 'App',
  data() {
    return {
      tarefa: '',
      autor: '',
      posts: [],
      email: '',
      senha: ''
    };
  },
  methods: {
    // Método para cadastrar usuário no Firebase Authentication
    async cadastrarUsuario() {
      try {
        // Primeiro, verificar se o e-mail já existe no Firebase
        const signInMethods = await auth.fetchSignInMethodsForEmail(this.email);

        // Se o e-mail já estiver em uso, o Firebase retornará métodos de login
        if (signInMethods.length > 0) {
          alert('Este e-mail já está em uso. Tente outro.');
          return; // Impede a criação do usuário
        }

        // Criar usuário no Firebase
        const userCredential = await auth.createUserWithEmailAndPassword(this.email, this.senha);

        // Confirme se o cadastro foi feito com sucesso
        console.log('Usuário cadastrado com sucesso:', userCredential.user);

        alert('Usuário cadastrado com sucesso!');
        this.email = '';  
        this.senha = '';  // Limpar o campo de senha

      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);  // Exibe o erro no console
        alert('Erro ao cadastrar usuário: ' + error.message);
      }
    },
    
    async cadastrar() {
      try {
        await db.collection('posts').add({
          tarefa: this.tarefa,
          autor: this.autor
        });

        alert('Cadastro realizado com Sucesso!');
        this.limparCampos(); // Limpar os campos após o cadastro
        this.buscarPosts(); // Atualiza a lista de posts
      } catch (error) {
        alert('Algo deu errado: ' + error);
      }
    },
    
    async buscarPosts() {
      try {
        const querySnapshot = await db.collection('posts').get();
        this.posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        alert('Erro ao buscar posts: ' + error);
      }
    },

    async atualizarPost(post) {
      try {
        await db.collection('posts').doc(post.id).update({
          tarefa: post.tarefa,
          autor: post.autor
        });

        alert('Post atualizado com sucesso!');
        this.limparCampos(); // Limpar os campos após a atualização
        this.buscarPosts(); // Atualiza a lista de posts
      } catch (error) {
        alert('Erro ao atualizar post: ' + error);
      }
    },

    async excluirPost(postId) {
      try {
        await db.collection('posts').doc(postId).delete();

        alert('Post excluído com sucesso!');
        this.buscarPosts(); // Atualiza a lista de posts
      } catch (error) {
        alert('Erro ao excluir post: ' + error);
      }
    },

    limparCampos() {
      this.tarefa = '';
      this.autor = '';
    }
  },
  created() {
    this.buscarPosts();
  }
}
</script>

<style>
#app {
  position: relative;
  min-height: 100%;
  overflow-y: auto;
}

#app::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

/* Outros estilos do conteúdo... */

.content {
  color: white;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;  /* Alterado de center para flex-start para que o conteúdo não fique centralizado */
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5); /* Fundo escuro com transparência */
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
  margin-top: 20px;  /* Distância do topo para evitar sobreposição */
}

.register-container {
  background-color: rgba(0, 0, 0, 0.6); /* Fundo escuro para o cadastro */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.7); /* Sombra vermelha */
  margin-bottom: 30px;
}

/* Estilos para os campos de entrada */
input[type="text"], input[type="email"], input[type="password"] {
  width: 100%;
  max-width: 270px;
  height: 60px;
  padding: 12px;
  font-size: 18px;
  font-family: "Courier New", monospace;
  color: #fff;
  background-color: #333;
  border: 4px solid #ff0000; /* Limite em vermelho */
  border-radius: 5px;
  transition: all 0.3s ease;
}

input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus {
  background-color: #000;
  color: #fff;
  border-color: #ff0000;
  outline: none;
}

button {
  padding: 10px 20px;
  margin: 10px;
  background-color: #ff0000;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #cc0000;
}

.post-list {
  list-style-type: none;
  padding: 0;
}

.post-list li {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
}

.post-list input {
  margin-top: 10px;
  margin-bottom: 10px;
}

</style>
