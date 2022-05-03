<template>
  <div class="container">
    <HeaderWall />

    <!-- Page principale regroupant l'ajout de post et le fil d'actualité -->
    <main class="main-wall">
    

      <!-- Bouton Scroll to Top-->
      <button class="toTop" @click="toTop" title="Retour en haut de page">
        <span class="fa fa-chevron-up"></span>
      </button>
    </main>
  </div>
</template>

<script>
import HeaderWall from "../components/HeaderWall.vue";

export default {
  name: "Wall",
  components: {
    HeaderWall,
    AddPost,
    Post,
  },
  
};
</script>

<style scoped>
.container {
  margin: 0;
}
.main-wall {
  background-attachment: fixed;
  background-image: url("../assets/test2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  height: auto;
  padding: 3%;
}
.wall-card {
  width: 50%;
  margin: auto;
  padding: 1% 2% 1% 2%;
  background: #f1f1f1;
  border-radius: 2px;
  box-shadow: 0 0 20px #000000b3;
  box-sizing: border-box;
  margin-bottom: 3%;
}
.post-card-header {
  display: flex;
  align-items: center;
}
.post-header-pic-round {
  border-radius: 50% !important;
  height: 50px;
  width: 50px;
}
.post-header-name-date {
  margin-left: 5%;
}
.post-header-name {
  font-size: 1.1em;
  font-weight: bold;
}
.post-header-date {
  color: rgb(88, 88, 88);
}
.post-content {
  margin: auto;
}
.wall-img {
  width: 100%;
}
.post-likes {
  display: flex;
  align-items: center;
  margin-left: 5%;
}
.post-likes img {
  width: 5%;
  height: 5%;
  margin-right: 1%;
}
.card-sep {
  color: rgb(30, 51, 121);
}
.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#icon-like,
#icon-comment {
  transition: transform 0.2s;
}
#icon-like:hover,
#icon-comment:hover {
  transform: scale(1.3);
}
.post-action-like {
  margin-left: 20%;
}
.post-action-comment {
  margin-right: 20%;
}
.post-action-like,
.post-action-comment {
  width: 20%;
}
.like-txt,
.comment-txt {
  margin-left: 10%;
}
.comment-auth {
  display: flex;
  flex-direction: row;
  margin-top: 3%;
  margin-bottom: 1%;
}
.comment-user {
  display: flex;
  flex-direction: column;
  margin-left: 2%;
  padding: 1%;
  border-radius: 5px;
  background-color: rgb(219, 222, 226);
  height: 50px;
  line-height: 0.8;
}
.comment-user-name {
  font-weight: bold;
}
.comment-pic-round {
  border-radius: 50% !important;
  height: 50px;
  width: 50px;
}
.com-input {
  width: 97%;
  height: 3em;
  padding: 1%;
  margin-top: 2%;
  margin-bottom: 2%;
  border-radius: 5px;
}
.com-input:focus {
  color: #495057;
  background-color: #fff;
  border-color: rgb(30, 51, 121);
  outline: 0;
  box-shadow: none;
}
/* Boutons options de post */
.dropdown-btn {
  color: black;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}
.dropdown {
  margin-left: auto;
  position: relative;
  display: flex;
}
.dropdown-options {
  margin-left: 10%;
  font-weight: bold;
}
.dropdown-content {
  background-color: #f1f1f1;
  border-radius: 5px;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  position: absolute;
  top: 55px;
  right: 10px;
}
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  margin: 1%;
}
.dropdown-content a:hover {
  background-color: #ddd;
}
.show {
  display: block;
}
/* Bouton Scroll to the Top */
.toTop {
  width: 7vh;
  height: 5vh;
  position: absolute;
  right: 0;
  margin-right: 5%;
}
/* Medium devices (tablets, 768px and up) */
@media screen and (max-width: 1023px) {
  .wall-card {
    width: 60%;
    margin-bottom: 5%;
  }
}
/* Small device (smartphone, to 767px max) */
@media screen and (max-width: 767px) {
  .wall-card {
    width: 80%;
    margin-bottom: 8%;
  }
}
</style>