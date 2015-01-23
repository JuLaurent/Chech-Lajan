# Chèch Lajan : CDC

**Chèch Lajan** part d'un constat simple : on ne sait jamais vraiment où se trouve le distributeur de billets le plus proche.

Avec l'avénement des smartphones, il serait chouette d'avoir à notre disposition un service qui puisse nous indiquer les distributeurs de billets autour de nous, quelle qu'en soit la banque.

## Objectifs

### Disponibilité sous forme de *webapp*

Les modalités d'accès aux apps store sont contraignantes, et je veux pouvoir mettre à jour facilement mon application. De plus, je que tout le monde puisse l'utiliser.

### Affichage en deux formes : liste ou carte

Je veux pouvoir avoir au choix une liste ou une représentation cartographiée des distributeurs aux alentours : le plus proche géographiquement n'est pas toujours le plus accessible.

### Possibilité d'intéragir avec les distributeurs

Je veux que les utilisateurs puissent voir et comprendre qu'un distributeur est en panne ou vide, afin de choisir un autre distributeur.

## Impératifs techniques

Le résultat doit être rapide et agréable à utiliser.

### API Ouverte

Les données que j'ai collectées sont publiques, et donc j'aimerai que l'API du projet soit ouverte, et qu'elle utilise une architecture `REST`.
