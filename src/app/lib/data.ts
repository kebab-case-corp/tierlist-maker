export const tierlists = [
    {
        id: 'hoi',
        userId: 'aaa',
        criterias: [
            { name: 'Force', maxRate: 5, description: '' },
            { name: 'Style', maxRate: 5, description: '' },
            { name: 'Technique', maxRate: 5, description: '' },
            { name: 'Impact', maxRate: 5, description: '' },
        ],
        tiers: [
            { name: 'S', min: 16 },
            { name: 'A', min: 12 },
            { name: 'B', min: 8 },
            { name: 'C', min: 4 },
            { name: 'D', min: 0 },
        ],
        name: 'Reborn',
        items: [
            {
                image: `https://medias.spotern.com/spots/w640/67/67512-1532336916.jpg`,
                ratings: [
                    { criteria: 'Force', rate: 0 },
                    { criteria: 'Style', rate: 0 },
                    { criteria: 'Technique', rate: 0 },
                    { criteria: 'Impact', rate: 0 },
                ],
                id: 'lprrm',
                totalRating: 0,
                tier: "D"
            },
            {
                image: `https://static.wikia.nocookie.net/reborn/images/8/8d/Tsuna_2.PNG`,
                ratings: [
                    { criteria: 'Force', rate: 0 },
                    { criteria: 'Style', rate: 0 },
                    { criteria: 'Technique', rate: 0 },
                    { criteria: 'Impact', rate: 0 },
                ],
                id: 'lpm',
                totalRating: 15,
                tier: "D"
            },
        ],
        unratedItems: [
            {
                image: `https://static.wikia.nocookie.net/reborn/images/2/27/Lambo_Anime2.png`,
                id: 'lqqqqm',
            },
            {
                image: `https://static.wikia.nocookie.net/reborn/images/d/dc/M_Rokudo.PNG`,
                id: 'ddef'
            },
        ],
    },
]