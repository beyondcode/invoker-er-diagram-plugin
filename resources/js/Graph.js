class Graph {
    constructor() {
        this.models = [];
    }

    addModel(model) {
        
        this.models.push(model);
    }

    getModelName(model) {
        return model.replace(/^\s+|\s+$/g, '').toLowerCase()
    }

    render() {
        let graph = `digraph "G" {
style="filled"
bgcolor="transparent"
fontsize="12"
labelloc="t"
concentrate="1"
splines="polyline"
overlap=""
nodesep="2"
rankdir="LR"
pad="0.5"
ranksep="2"
esep="1"
fontname="Helvetica Neue"
`;
        this.models.forEach(model => {
            if (model.definition.mutators && model.definition.mutators.relations) {
                model.definition.mutators.relations.forEach(relation => {
                    let ownerKey = relation.related.ownerKey || 'id';
                    let foreignKey = relation.related.foreignKey || 'id';
                graph += `
${this.getModelName(model.definition.model.name)}:${ownerKey} -> ${this.getModelName(relation.related.name)}:${foreignKey} [
    label=" "
    xlabel="${relation.type} 
${relation.name}"
    color="#F77F00"
    penwidth="1.8"
    fontname="Helvetica Neue"
    dir="both"
    arrowhead="tee"
    arrowtail="crow"
]              
`;
            })
        }
        })

        this.models.forEach(model => {
            graph += `
"${this.getModelName(model.definition.model.name)}" [
    label=<<table width="100%" height="100%" border="0" margin="0" cellborder="1" cellspacing="0" cellpadding="10">
<tr width="100%"><td width="100%" bgcolor="#d3d3d3"><font color="#333333">${model.definition.model.name}</font></td></tr>
`
model.definition.attributes.forEach(attribute => {
    graph += `<tr port="${attribute.name}" width="100%"><td bgcolor="#ffffff" width="100%"><font color="#333333">${attribute.name} (${attribute.cast})</font></td></tr>`
});
graph += `
</table>>
    margin="0"
    shape="rectangle"
    fontname="Helvetica Neue"
]
`
        })

        graph += `}`;

        return graph;
    }
}

export default new Graph;