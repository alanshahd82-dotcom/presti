# PrestigeCars — Application Mobile 🚗

Application mobile officielle de [PrestigeCars Maroc](https://www.prestigecars.ma/) — Location de voiture premium à Rabat.

[![Build Android APK](https://github.com/alanshahd82-dotcom/presti/actions/workflows/build-android.yml/badge.svg)](https://github.com/alanshahd82-dotcom/presti/actions/workflows/build-android.yml)

---

## 📱 À propos

Application native (Expo) qui affiche le site PrestigeCars dans une interface mobile soignée :

- Header natif aux couleurs de la marque (bleu marine `#1C2951` + or `#F5B300`)
- Navigation arrière Android (bouton natif + swipe)
- Bouton de rafraîchissement
- Écran de chargement brandé
- Écran d'erreur si pas de connexion internet

---

## ⚙️ Build automatique sur GitHub (sans compte Expo)

> Le build se lance **automatiquement** à chaque push sur `main`.

### Comment télécharger l'APK

1. Aller sur **[Actions](https://github.com/alanshahd82-dotcom/presti/actions)**
2. Cliquer sur le dernier workflow **"Build Android APK"**
3. En bas de la page, dans la section **Artifacts**, télécharger `PrestigeCars-debug-XX`

![GitHub Actions screenshot](https://docs.github.com/assets/cb-15158/mw-1440/images/help/repository/actions-quickstart-artifact.webp)

### Lancer un build manuellement

1. Aller sur **[Actions → Build Android APK](https://github.com/alanshahd82-dotcom/presti/actions/workflows/build-android.yml)**
2. Cliquer **"Run workflow"** → **"Run workflow"**

---

## 🏪 Pour publier sur le Google Play Store

Le build automatique produit un **APK debug** (pour tester). Pour le Play Store, il faut un **AAB signé**.

### Étape 1 — Créer un keystore (signature)

```bash
# Sur votre machine locale
keytool -genkey -v \
  -keystore prestigecars.keystore \
  -alias prestigecars \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### Étape 2 — Encoder le keystore en base64

```bash
base64 -i prestigecars.keystore | pbcopy   # Mac
base64 prestigecars.keystore               # Linux (copier le résultat)
```

### Étape 3 — Ajouter les secrets GitHub

Aller dans : **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valeur |
|--------|--------|
| `KEYSTORE_BASE64` | Le contenu base64 du fichier keystore |
| `KEY_ALIAS` | `prestigecars` |
| `KEY_PASSWORD` | Mot de passe de la clé |
| `STORE_PASSWORD` | Mot de passe du keystore |

### Étape 4 — Lancer le build release

Après avoir ajouté les secrets, relancer le workflow. Il produira un fichier `.aab` prêt pour le Play Store.

---

## 🛠️ Stack technique

| Technologie | Version |
|------------|---------|
| Expo SDK | 54.0.27 |
| React Native | 0.81.5 |
| React | 19.0.0 |
| TypeScript | 5.9.x |
| react-native-webview | 13.13.5 |

## 📁 Structure

```
├── .github/workflows/
│   └── build-android.yml   # CI/CD GitHub Actions
├── app/
│   ├── _layout.tsx         # Layout racine + SafeAreaProvider
│   └── index.tsx           # Écran principal WebView
├── assets/images/
│   ├── icon.png            # Icône officielle PrestigeCars
│   ├── splash.png          # Écran de démarrage
│   └── adaptive-icon.png   # Icône Android adaptive
├── app.json                # Config Expo (package: ma.prestigecars.app)
├── eas.json                # Config EAS Build (optionnel)
└── package.json
```

## 📞 Contact

📞 +212 660 222 580  
🌐 https://www.prestigecars.ma/
