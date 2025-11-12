
const data = {
    refs: [
        {
            img: "refs/gray.png", text: `# gray
color-gray
# gray-cht
color-gray-cht` }
    ],
    layers: [
        {
            img: "layers/r.png", text: `r-1
r-2` },
        { img: "layers/g.png", text: `g` },
        { img: "layers/b.png", text: `b` }
    ],
    contnets: [
        {
            layers: ["layers/r.png", "layers/g.png"],
            text: `# r_g
r
g
# r_g-cht
r-cht
g-cht`
        },
        {
            layers: ["layers/g.png", "layers/b.png"],
            text: `# g_b
g
b
# g_b-cht
g-cht
b-cht`
        },
        {
            layers: ["layers/b.png", "layers/r.png"],
            text: `# b_r
b
r
# b_r-cht
b-cht
r-cht`
        }
    ]

};




