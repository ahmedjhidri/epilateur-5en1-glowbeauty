GlowBeauty — Mini-boutique single-product (Tunisie)
Produit: Épilateur électrique portable 5 en 1

Livrable (prêt à déployer):
- index.html
- styles.css
- script.js
- assets/ (placeholders images/vidéo)

============================================================
1) Lancer en local
============================================================
Option simple:
- Double-clique sur index.html

Option conseillée (évite certains soucis CORS vidéo / cache):
- Mac: dans le dossier Épilateur
  python3 -m http.server 8080
  puis ouvre http://localhost:8080

============================================================
2) Personnaliser rapidement (les 3 réglages qui comptent)
============================================================
A) Numéro WhatsApp
Fichier: script.js
Cherche:
  whatsappNumberE164: "21600000000"
Remplace par ton numéro sans "+" (format E.164), ex:
  "21620123456"

B) Prix
Fichier: script.js
Change:
  priceTND: 89
Le CTA WhatsApp et le checkout se mettront à jour.

C) Images / vidéo (placeholders)
Remplace dans /assets:
- hero-a.svg et hero-b.svg (images hero A/B)
- before-1.svg, after-1.svg, before-2.svg, after-2.svg (Avant/Après)
- video-poster.svg (poster vidéo)
- demo-15s.mp4 (vidéo démo 15s)

Astuce perf:
- Images: exporte en WebP (ex: hero-a.webp) puis remplace les src dans index.html
- Vidéo: H.264 (mp4), 720x1280 ou 1080x1920 pour Reels

============================================================
3) A/B test du hero (2 variantes prêtes)
============================================================
La page supporte:
- Variante A: ?v=A
- Variante B: ?v=B

Exemples:
- index.html?v=A
- index.html?v=B

Sans paramètre, le site choisit A ou B aléatoirement (puis mémorise le choix en localStorage).

============================================================
4) Commandes: WhatsApp + formulaire COD
============================================================
WhatsApp (CTA principal):
Le texte envoyé est:
  "Je veux commander l'épilateur 5-en-1 – Quantité: 1 – Prix: 89 TND"
Tu peux ajuster le texte dans script.js (fonction buildWhatsAppText).

Formulaire COD (modal):
- Champs: Nom / Téléphone / Adresse / Quantité
- Enregistre la commande en JSON dans localStorage:
  key: glowbeauty_orders_v1

Pour voir les commandes test:
- Ouvre DevTools > Application > Local Storage
- Cherche glowbeauty_orders_v1

============================================================
5) Option B: envoyer la commande par email
============================================================
Deux options:

Option 1 (recommandé): Formspree (sans backend)
- Crée un formulaire Formspree
- Copie l’endpoint (https://formspree.io/f/xxxxxx)
- Colle-le dans script.js:
  formspreeEndpoint: "https://formspree.io/f/xxxxxx"

Option 2: mailto (fallback)
- Change fallbackEmailTo dans script.js:
  fallbackEmailTo: "tonemail@example.com"

============================================================
6) Tracking (Pixel / GA4) — placeholders
============================================================
Dans index.html, tu as:
- FB_PIXEL_PLACEHOLDER_START/END
- GA4_PLACEHOLDER_START/END

Colle tes snippets officiels à la place, et mets tes IDs (PIXEL_ID / G-XXXXXXXXXX).

============================================================
7) Déploiement rapide
============================================================
GitHub Pages:
1) Crée un repo (ex: glowbeauty-epilateur)
2) Mets les fichiers à la racine du repo
3) Settings > Pages > Deploy from a branch > main / root
4) Attends le lien public

Netlify:
1) Drag & drop du dossier Épilateur (ou zip) sur Netlify
2) Le site est live en 30 secondes

============================================================
8) Textes pub prêts à copier
============================================================
3 titres courts (Instagram/FB):
1) "Épilateur 5-en-1 • Peau douce en 5 min"
2) "Un seul appareil pour tout: épiler, raser, exfolier"
3) "Livraison 1–3 jours • Paiement à la livraison"

Texte annonce Facebook/Instagram (avec CTA):
Titre: Épilateur électrique 5 en 1 – Livraison Tunisie

Texte:
Un appareil, 5 fonctions — peau douce en 5 minutes.
✅ Épilation sans douleur
✅ Tondeuse bikini
✅ Rasage précis
✅ Brosse exfoliante
✅ Massage & nettoyage

💗 Prix: 89 TND
🚚 Livraison: 1–3 jours
💳 Paiement à la livraison
🔁 Satisfait ou remboursé 7 jours • USB rechargeable

👉 Clique sur “Envoyer un message” pour commander sur WhatsApp.

============================================================
9) Scripts vidéo 15s (Reel/TikTok) — 3 variantes
============================================================
Format conseillé: 9:16, cuts rapides, sous-titres.

Script 1 — “5 fonctions”
0-2s: Gros plan appareil + texte écran: "5-en-1"
2-6s: Cuts: tête épilation / rasage / tondeuse bikini
6-10s: Cuts: brosse exfoliante / massage
10-13s: Avant/Après (photo 1)
13-15s: Texte: "89 TND • Livraison 1-3j • COD" + CTA: "WhatsApp pour commander"

Voix-off:
"Un seul appareil, cinq fonctions. Pour une peau douce en quelques minutes. 89 dinars, livraison rapide, paiement à la livraison. Commande sur WhatsApp."

Script 2 — “Routine express”
0-3s: Texte: "Routine express 5 min"
3-7s: Démo jambe/bras (gestes simples)
7-10s: Exfoliation (avant) -> peau lisse (après)
10-13s: Pack + recharge USB
13-15s: CTA: "Écris 'Glow' sur WhatsApp"

Voix-off:
"Routine express: épiler ou raser, exfolier, puis massage. Recharge USB. Écris-nous sur WhatsApp pour commander."

Script 3 — “Objection COD”
0-3s: Texte: "Paiement à la livraison ✅"
3-7s: Démo rapide (1-2 zones)
7-11s: Témoignage écran: "Livraison en 2 jours" (placeholder)
11-15s: Prix + CTA WhatsApp

Voix-off:
"Tu hésites à payer en ligne ? Ici, paiement à la livraison. Livraison 1 à 3 jours. Clique et commande sur WhatsApp."

============================================================
10) Où modifier le contenu texte
============================================================
- SEO title + meta description: index.html (head)
- Tagline / features / FAQ / avis: index.html
- WhatsApp message & config: script.js

