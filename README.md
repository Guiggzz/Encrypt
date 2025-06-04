# Documentation Technique : Chiffrement et Déchiffrement avec CryptoJS

## 1. Introduction

Ce script JavaScript permet d'effectuer un chiffrement AES (Advanced Encryption Standard) sécurisé des messages saisis par l'utilisateur à l'aide de la bibliothèque CryptoJS. Le message chiffré est ensuite intégré dans l'URL, permettant son partage sécurisé. Un utilisateur peut ensuite récupérer et déchiffrer ce message en fournissant le mot de passe.

### Technologies utilisées :
- **JavaScript** : langage natif du navigateur pour assurer l'interactivité et la manipulation des URLs.
- **CryptoJS** : bibliothèque JavaScript robuste pour le chiffrement AES et la dérivation de clé (PBKDF2).
- **HTML** : interactions dynamiques avec l'utilisateur via des éléments HTML et gestion des événements.
- **Tailwind CSS** : framework CSS pour faire du style rapidement en intégrant les balises CSS directement dans les classes.

---

## 2. Fonctionnalités

### 2.1 Ce que l’utilisateur voit

Le site web comporte une fonctionnalité principale qui fonctionne grâce à plusieurs sous-fonctionnalités.

Le User Flow de création de message est le suivant :  
**_Insérer une image représentant le User Flow ici_**

L'objectif était de créer un site accessible et rapide d’utilisation.

Si l’utilisateur veut décoder le message, il doit simplement copier l’URL, la coller dans la barre d’adresse et entrer le mot de passe.

---

### 2.2 Ce que l’utilisateur ne voit pas



Comme illustré dans ce schéma, AES 256 permet de chiffrer sur 256 bits, ce qui élève le nombre de possibilités à **2^256**.

De plus, la dérivation de clé avec **PBKDF2** permet de transformer un mot de passe simple en une clé complexe, rendant son déchiffrement beaucoup plus difficile.

---

## 3. Conclusion et Améliorations Possibles

### ✅ Avantages :
- **Chiffrement sécurisé AES-256 CBC.**
- **Utilisation de PBKDF2 pour renforcer la robustesse des mots de passe.**
- **Interface fluide avec manipulation du DOM et événements interactifs.**
