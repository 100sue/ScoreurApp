<template>
  <div class="container">
    <HeaderWall />

    <!-- Page Profil regroupant les informations de l'utilisateur -->
    <main class="main-profil">
      <section class="profil-card">
        <div class="profil-pic-name">
          <!-- Mise à jour de l'avatar (photo de profil) -->
          <form
            class="profil-pic-form"
            @submit.prevent="updateUserImage($event)"
          >
            <label for="profilPic" class="profil-avatar">
              <i
                class="fas fa-user-circle"
                id="profil-avatar-icon"
                v-if="!user.image"
              ></i>
              <img
                id="profil-avatar-img"
                alt="Avatar"
                title="Modifier mon avatar"
                :src="`http://localhost:3000/${user.image}`"
                v-else
              />
            </label>
            <input type="file" name="avatar" id="profilPic" accept="image/*" />
            <button
              type="submit"
              class="profil-avatar-btn"
              title="Enregistrer le nouvel avatar"
            >
              Valider
            </button>
          </form>

          <h1 class="profil-name">{{ user.nom }} {{ user.prenom }}</h1>
        </div>

        <hr class="profil-sep" />

        <!-- Mise à jour du nom, prénom et email -->
        <div class="profil-informations">
          <form class="form-profil" @submit.prevent="updateProfil(user.id)">
            <div class="form-group">
              <label for="nom">Nom</label>
              <input
                type="text"
                v-model.lazy="user.nom"
                name="nom"
                id="nom"
                class="form-input"
                required
              />
              <div class="form-err"></div>
            </div>
            <div class="form-group">
              <label for="prenom">Prénom</label>
              <input
                type="text"
                v-model.lazy="user.prenom"
                name="prenom"
                id="prenom"
                class="form-input"
                required
              />
              <div class="form-err"></div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                v-model.lazy="user.email"
                name="email"
                id="email"
                class="form-input"
                required
              />
              <div class="form-err"></div>
            </div>
            <button class="form-btn" title="Enregistrer les modifications">
              Enregistrer les modifications
            </button>
          </form>
        </div>

        <hr class="profil-sep" />

        <!-- Suppression du compte -->
        <button
          class="suppr-btn"
          @click="deleteUser(user.id)"
          title="Supprimer le compte"
        >
          Supprimer le compte
        </button>
      </section>
    </main>
  </div>
</template>

<script>
import HeaderWall from "../components/HeaderWall.vue";
import axios from "axios";
export default {
  name: "Profil",
  components: {
    HeaderWall,
  },
  data() {
    return {
      user: {
        nom: "",
        prenom: "",
        email: "",
        image: "",
      },
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.getUserProfil();
  },
  methods: {
    // Récupération des informations de l'utilisateur
    getUserProfil() {
      const userId = localStorage.id;
      axios
        .get(`http://localhost:3000/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((res) => {
          this.user = res.data;
        })
        .catch(() => {
          this.$router.push({ name: "Home" });
        });
    },
    // Modification du compte de l'utilisateur
    updateProfil(id) {
      axios({
        method: "put",
        url: `http://localhost:3000/api/users/${id}`,
        data: this.user,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }).then(() => {
        alert("Profil modifié avec succès !");
      });
    },
    // Suppression du compte de l'utilisateur
    deleteUser(id) {
      if (
        window.confirm(
          "ATTENTION : Vous êtes sur le point de supprimer votre compte ! Toute suppression est définitive, êtes-vous certain de ce choix ?"
        )
      ) {
        axios
          .delete(`http://localhost:3000/api/users/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((res) => {
            if (res) {
              localStorage.removeItem("token");
              this.$router.push("/");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    // Ajout d'un avatar personnalisé
    updateUserImage(event) {
      const image = event.target.avatar.files[0];
      const id = this.user.id;
      const formData = new FormData();
      formData.append("image", image);
      axios({
        method: "post",
        url: `http://localhost:3000/api/users/${id}/image`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${this.token}`,
        },
      })
        .then((res) => {
          this.user.image = res.data.path;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
.main-profil {
  background-attachment: fixed;
  background-image: url("../assets/test2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  padding: 3%;
}
.profil-card {
  width: 30%;
  height: auto;
  margin: auto;
  padding: 1%;
  background: #315ef0;
  border-radius: 5px;
  box-sizing: border-box;
  border: 2px solid #333;
  box-shadow: 0px 3px 3px #333;
}
.profil-avatar {
  width: 50px;
  height: 50px;
}
#profil-avatar-icon {
  font-size: 3em;
  color: #fd340a;
}
#profil-avatar-img {
  height: 50px;
  width: 50px;
  border-radius: 50% !important;
  box-shadow: 0 0 3px #000000b3;
}
.profil-avatar-btn {
  margin-top: 15%;
  background-color: #315ef0;
  border-radius: 10px;
  color: white;
}
.profil-pic-form > input {
  display: none;
}
.profil-pic-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.container {
  overflow: hidden;
  margin: 0;
}
.profil-pic-name {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2%;
  margin-bottom: 3%;
}
.profil-name {
  margin-left: 5%;
}
.profil-informations {
  width: 80%;
  margin: auto;
  padding-top: 3%;
  padding-bottom: 3%;
}
.form-group {
  display: flex;
  flex-direction: column;
}
input {
  margin-bottom: 6%;
  height: 2.2rem;
}
.form-btn {
  width: 100%;
  margin-top: 3%;
  background-color: rgb(49, 94, 240);
  color: white;
  height: 3em;
  border-radius: 10px;
  border: 1px solid #d4d3e8;
  box-shadow: 0px 2px 2px black;
  text-transform: uppercase;
  font-weight: 700;
}
.suppr-btn {
  width: 50%;
  display: block;
  margin: auto;
  background-color: #f00909;
  color: white;
  height: 3em;
  border-radius: 10px;
  border: 1px solid #d4d3e8;
  box-shadow: 0px 2px 2px black;
  text-transform: uppercase;
  font-weight: 700;
}
.profil-sep {
  color: rgb(30, 51, 121);
  margin: 3%;
}
/* Medium devices (tablets, 768px and up) */
@media screen and (max-width: 1023px) {
  .profil-card {
    width: 50%;
    margin-top: 3%;
  }
}
/* Small device (smartphone, to 767px max) */
@media screen and (max-width: 767px) {
  .profil-card {
    width: 80%;
    margin-top: 5%;
  }
}
</style>