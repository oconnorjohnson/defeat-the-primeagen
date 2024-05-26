# Defeat the Primeagen

## What IS this?

We participated in the 2024 EdgeDB hackathon by creating a silly game based on Space Invaders called Defeat the Primeagen. 

## EdgeDB Usage in the Project

For our project, we decided to create a game called *Defeat The Primeagen*, inspired by *Space Invaders*. We utilized EdgeDB Cloud, EdgeDB Auth, and wrote all our queries using EdgeQL.

To play the game, a user must log in via GitHub OAuth. After logging in, users are redirected back to our site. If a user is not already registered in our database, we create a new user entry. At the time of user creation, we also generate links to new stat and achievement objects. The stat object holds game data such as scores and enemies destroyed, while the achievement object collects humorous achievements the player can earn by meeting various random stat combinations. These achievements are named after different "Prime-isms"—phrases that The Primeagen says on his streams. For example, to earn the "420" achievement, a user must score 420 points, and to earn the "Chad Stack" achievement, they must miss three friendly requests. The stat combinations are intentionally ridiculous, with some being impossible to achieve, aligning with our aim to create a meme-worthy game.

We decided to update player stats and achievements whenever they pause the game. Moving forward, we are exploring other options for triggering database updates. We also retrieve the current user's stats and achievements before the game begins, along with the top five user scores. We are still working on visualizing the retrieved data.

Working with EdgeDB has been an interesting experience. I started by exploring various quick starts and eventually worked through seven or eight chapters of the EdgeDB book, which creatively uses Dracula as the backdrop for learning about EdgeDB. My favorite aspect so far is the EdgeQL language, which I would definitely consider using in future projects. Deploying EdgeDB Cloud, using the CLI tool, and handling migrations have all been straightforward and enjoyable. The only part I found challenging was implementing EdgeDB Auth, as I felt there could be more examples and additional information to aid in setup.

Overall, creating *Defeat The Primeagen* with EdgeDB has been a rewarding experience, and I look forward to refining the game further.

## Contributors

Christine Dang [ChristineDang](https://github.com/ChristineDang)

Christine illustrated and designed most of the assests in our game and menus, including
the animated sprites of the binary/Primeagen, the server background, and the pause screen.

Keegan Anglim [guitarkeegan](github.com/guitarkeeegan)

Setup user authentication with EdgeDB and Github, as well as all EdgeDb queries and interactions. He also wrote the sick game soundtrack 🚀

Daniel Johnson [oconnorjohnson](github.com/oconnorjohnson)

Daniel did everything else! He used PhaserJS along with NextJS, to create the Space Invadors style game, and implemented all of Christine's designs and animation.

## Now, go defeat the Primeagen!

[Defeat_the_Primeagen](https://defeat-the-primeagen.vercel.app/)
