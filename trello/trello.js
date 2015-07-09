var fs = require('fs');
var config = require('./config');
var shame =
{
    checklist: {},
    ledger: {},
    source: {},
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
                // Loop through all of the checklists in this card
                card.idChecklists.forEach(function(idChecklist)
                {
                    var checklist = shame.checklist[idChecklist];
                    
                    // Loop through all of the rows in the checklist
                    checklist.checkItems.forEach(function(item)
                    {
                        if(item.state == "incomplete")
                        {
                            // Match the person's name and the amount they owe
                            var row = item.name.match(/(.*?) - \$([0-9.]+)/);
                            var name = row[1];
                            var amount = parseFloat(row[2]);

                            if(shame.ledger[name] === undefined)
                                shame.ledger[name] = [];

                            if(shame.total[name] === undefined)
                                shame.total[name] = 0;

                            if(shame.source[name] === undefined)
                                shame.source[name] = {};

                            if(shame.source[name][checklist.name] === undefined)
                                shame.source[name][checklist.name] = 0;

                            // Save the card name, checklist name, and amount
                            // For example: June 2015 - Utilities - $45
                            shame.ledger[name].push(card.name + ' - ' + checklist.name + ' - $' + amount);
                            shame.source[name][checklist.name] += amount;
                            shame.total[name] += amount;
                        }
                    });
                });
            }
        });

        // Now output the totals
        console.log(shame.ledger);
        console.log(shame.source);
        console.log(shame.total);
    }
    else
    {
        console.log("There was an error reading your board file! Are you sure the ID is correct?");
    }
});
