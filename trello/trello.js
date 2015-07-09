var fs = require('fs');
var config = require('./config');
var shame =
{
    checklist: {},
    ledger: {},
    total: {}
};

fs.readFile('data/' + config.board + '.json', 'utf8', function(error, data)
{
    if(!error && data)
    {
        var board = JSON.parse(data);
        console.log("Information for: " + board.name);

        // Loop through lists to find the one we're looking for
        board.lists.forEach(function(list)
        {
            if(list.name == config.list)
            {
                shame.list = list.id;
            }
        });

        // Loop through checklists to find out what they contain
        board.checklists.forEach(function(checklist)
        {
            shame.checklist[checklist.id] = checklist;
        });
        
        // Now loop through the cards
        board.cards.forEach(function(card, index)
        {
            // Only pay attention to cards in the list of outstanding rent
            if(card.idList == shame.list)
            {
                console.log(card.name);
                console.log("=============");

                // Loop through all of the checklists in this card
                card.idChecklists.forEach(function(idChecklist)
                {
                    // Loop through all of the rows in the checklist
                    shame.checklist[idChecklist].checkItems.forEach(function(item)
                    {
                        if(item.state == "incomplete")
                        {
                            console.log(item.name);
                        }
                    });
                });

                console.log("------------");
            }
        });
    }
    else
    {
        console.log("There was an error reading your board file! Are you sure the ID is correct?");
    }
});
