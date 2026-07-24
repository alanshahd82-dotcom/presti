# PrestigeCars — Application Mobile

Application mobile officielle de [PrestigeCars Maroc](https://www.prestigecars.ma/) — Location de voiture premium à Rabat.

## À propos

Cette application affiche le site web de PrestigeCars dans une interface mobile native, avec :
- Header natif aux couleurs de la marque (bleu marine + or)
- Navigation arrière (bouton natif Android)
- Rafraîchissement (bouton refresh)
- Écran de chargement branded
- Écran d'erreur si pas de connexion

## Stack technique

- **Framework :** Expo SDK 53 + Expo Router
- **Langages :** React Native, TypeScript
- **WebView :** react-native-webview

## Structure du projet

```
├── app/
│   ├── _layout.tsx        # Layout racine
│   └── index.tsx          # Écran principal (WebView)
├── assets/
│   └── images/
│       ├── icon.png
│       ├── splash.png
│       └── adaptive-icon.png
├── app.json               # Config Expo (iOS + Android)
├── eas.json               # Config EAS Build
└── package.json
```

## Installation et lancement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start

# Scanner le QR code avec l'app Expo Go sur votre téléphone
```

## Build Android (Play Store)

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à votre compte Expo
eas login

# Configurer le projet (première fois)
eas build:configure

# Build production (AAB pour Play Store)
eas build --platform android

# Build APK pour test
eas build --platform android --profile preview
```

## Publier sur le Play Store

1. Créer un compte [Google Play Console](https://play.google.com/console)
2. Créer une nouvelle application
3. Uploader le fichier `.aab` généré par EAS
4. Remplir les informations de l'app (description, captures d'écran, etc.)
5. Soumettre pour review

## Informations de l'app

- **Package Android :** `ma.prestigecars.app`
- **Bundle iOS :** `ma.prestigecars.app`
- **Version :** 1.0.0
- **Site web :** https://www.prestigecars.ma/

## Contact

📞 +212 660 222 580  
🌐 https://www.prestigecars.ma/
