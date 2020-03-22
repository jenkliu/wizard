# w i z a r d s

GRAB THE MOST RECENT ROOM
db.rooms.find().sort({createdAt: -1})[0]

HOW DO I CALL MONGO FUNCTION FROM THE COMMAND LINE? rather than using the UI
meteor shell
Meteor.call('rooms.create')

WAITING FOR PEOPLE TO JOIN:

Start by creating a room: `rooms.create`
To create a player: `players.get_or_create`
To add/remove players to the associated room: `rooms.addPlayer`/`rooms.removePlayer`
When everyone's joined: `rooms.start`

PLAYING THE GAME

Initialize a round: `rooms.rounds.start` then `rooms.rounds.deal`
Bidding phase: update peoples' bids with `rooms.rounds.updateBid`

