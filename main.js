// Exécution du code quand la page est chargée
window.onload = function () {
    // Vérifie si un message chiffré est présent dans l'URL et affiche la section correspondante
    const urlParams = new URLSearchParams(window.location.search);
    // Récupère les paramètres de l'URL (ici, le paramètre 'data' contenant le message chiffré)
    const encryptedData = urlParams.get('data');

    if (encryptedData) {
        // Si le paramètre 'data' est trouvé dans l'URL, cache la section de chiffrement et affiche celle de déchiffrement
        document.getElementById('encryptSection').classList.add('hidden');
        document.getElementById('decryptSection').classList.remove('hidden');
    }
};

function validateMessage() {
    // Vérifie si un message a été saisi avant de passer à l'étape suivante
    const message = document.getElementById('message').value;
    if (!message) {
        alert("Veuillez saisir un message.");
        return;
    }
    // Si le message est valide, cache l'étape de saisie du message et affiche l'étape suivante (mot de passe)
    document.getElementById('messageStep').classList.add('hidden');
    document.getElementById('passwordStep').classList.remove('hidden');
}

function goBackToMessage() {
    // Retourne à l'étape de saisie du message
    document.getElementById('passwordStep').classList.add('hidden');
    document.getElementById('messageStep').classList.remove('hidden');
}

function deriveKey(password, salt) {
    // Cette fonction dérive une clé à partir du mot de passe et du sel (salt) en utilisant PBKDF2 (Password-Based Key Derivation Function 2)
    const keySize = 256 / 32; // La taille de la clé en bits, ici 256 bits
    const iterations = 10000; // Le nombre d'itérations pour rendre l'algorithme plus lent et résistant aux attaques
    // Utilisation de la bibliothèque CryptoJS pour appliquer PBKDF2
    return CryptoJS.PBKDF2(password, salt, { keySize: keySize, iterations: iterations });
}

function encryptMessage() {
    // Cette fonction chiffre le message avec AES-256 et génère une URL contenant les données chiffrées
    const message = document.getElementById('message').value;
    const password = document.getElementById('password').value;

    if (!message || !password) {
        alert("Veuillez saisir un message et un mot de passe.");
        return;
    }

    try {
        // Génère un sel (salt) aléatoire de 128 bits (16 octets)
        const salt = CryptoJS.lib.WordArray.random(128 / 8);
        // Génère un vecteur d'initialisation (IV) aléatoire de 128 bits (16 octets)
        const iv = CryptoJS.lib.WordArray.random(128 / 8);
        // Dérive la clé à partir du mot de passe et du sel
        const key = deriveKey(password, salt);

        // Chiffre le message avec AES en mode CBC (Cipher Block Chaining)
        const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });

        // Crée un objet contenant le sel, le vecteur IV, et le message chiffré
        const encryptedPackage = {
            salt: salt.toString(CryptoJS.enc.Base64), // Encode le salt en Base64
            iv: iv.toString(CryptoJS.enc.Base64), // Encode l'IV en Base64
            encrypted: encrypted.toString() // Le message chiffré au format chaîne de caractères
        };

        // Convertit l'objet en chaîne JSON, puis en Base64 pour l'intégrer dans l'URL
        const jsonString = JSON.stringify(encryptedPackage);
        const base64Data = btoa(jsonString);
        const encodedData = encodeURIComponent(base64Data); // Encode l'URL pour la transmettre sans problème

        // Récupère l'URL actuelle et ajoute le paramètre 'data' avec les données chiffrées
        const currentUrl = window.location.href.split('?')[0];
        const encryptedUrl = `${currentUrl}?data=${encodedData}`;

        // Affiche l'URL contenant le message chiffré dans la section prévue
        document.getElementById('encryptedUrl').textContent = encryptedUrl;

        // Cache l'étape du mot de passe et affiche la section contenant le résultat (URL)
        document.getElementById('passwordStep').classList.add('hidden');
        document.getElementById('resultSection').classList.remove('hidden');
    } catch (error) {
        alert("Erreur lors du chiffrement: " + error.message); // Affiche un message d'erreur en cas d'échec
    }
}

function decryptMessage() {
    // Cette fonction déchiffre le message chiffré en utilisant le mot de passe saisi
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedData = urlParams.get('data');
    const password = document.getElementById('decryptPassword').value;

    if (!password) {
        alert("Veuillez saisir le mot de passe.");
        return;
    }

    try {
        // Décode les données de l'URL et les transforme en chaîne JSON
        const decodedData = decodeURIComponent(encryptedData);
        const jsonString = atob(decodedData);
        const encryptedPackage = JSON.parse(jsonString);

        // Récupère le sel et le vecteur IV encodés en Base64, puis les décode
        const salt = CryptoJS.enc.Base64.parse(encryptedPackage.salt);
        const iv = CryptoJS.enc.Base64.parse(encryptedPackage.iv);
        const encrypted = encryptedPackage.encrypted; // Le message chiffré

        // Dérive la clé à partir du mot de passe et du sel
        const key = deriveKey(password, salt);

        // Déchiffre le message en utilisant AES en mode CBC avec la clé et l'IV
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });

        // Convertit le résultat en texte clair (UTF-8)
        const decryptedMessage = decrypted.toString(CryptoJS.enc.Utf8);

        // Si le message déchiffré est vide, c'est que le mot de passe était incorrect
        if (!decryptedMessage) throw new Error("Mot de passe incorrect");

        // Affiche le message déchiffré
        document.getElementById('decryptedMessage').textContent = decryptedMessage;
        document.getElementById('decryptedMessageSection').classList.remove('hidden');
        document.getElementById('decryptError').classList.add('hidden');
    } catch (error) {
        // Si une erreur survient (mot de passe incorrect ou autre), affiche un message d'erreur
        document.getElementById('decryptError').classList.remove('hidden');
        document.getElementById('decryptedMessageSection').classList.add('hidden');
    }
}

function copyToClipboard() {
    // Cette fonction copie l'URL chiffrée dans le presse-papiers
    const encryptedUrl = document.getElementById('encryptedUrl').textContent;
    // Utilise l'API Clipboard pour copier l'URL dans le presse-papiers
    navigator.clipboard.writeText(encryptedUrl).then(function () {
        const copyMessage = document.getElementById('copyMessage');
        // Affiche un message indiquant que l'URL a été copiée
        copyMessage.classList.remove('hidden');
        setTimeout(function () {
            // Cache le message après 2 secondes
            copyMessage.classList.add('hidden');
        }, 2000);
    }, function (err) {
        alert("Erreur lors de la copie: " + err); // Affiche une erreur si la copie échoue
    });
}