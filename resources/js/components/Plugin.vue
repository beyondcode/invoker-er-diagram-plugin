<template>
    <div class="w-full overflow-scroll" id="graphcontainer" v-html="output">

    </div>
</template>
<script lang="ts">
import Viz from 'viz.js';
import Graph from './../Graph';

const { Module, render } = require('viz.js/full.render.js');
const svgPanZoom = require('svg-pan-zoom');
import PluginContextStore from './../PluginContextStore';

export default {
    data() {
      return {
        output: '',
      }
    },
    methods: {
        findModels(namespace, results) {
            namespace.models.map(model => {
                results.push(model.class)
            })

            namespace.namespaces.map(namespace => this.findModels(namespace, results));
        },

        async loadGraph() {
          let modelClasses = [];

          if (this.$store.state.models.namespaces) {
              this.$store.state.models.namespaces.map(namespace => this.findModels(namespace, modelClasses))
          }
          
          const promises = modelClasses.map(async model => {
              return await invoker.getModelDefinition({ model });
          })

          const modelDefinitions = await Promise.all(promises);

          modelDefinitions.forEach(definition => {
              Graph.addModel({
                definition: definition.data,
              });
          });

          let viz = new Viz({ Module, render });

          viz.renderString(Graph.render())
          .then(element => {
              element = element.replace('<svg ', '<svg id="graph" class="w-full h-full" ');

              this.output = element;

              this.$nextTick(() => {
                svgPanZoom('#graph', {
                  zoomEnabled: true,
                  controlIconsEnabled: true,
                });
              })
          })
          .catch(error => {
              // Create a new Viz instance (@see Caveats page for more info)
              viz = new Viz({ Module, render });
          });
        }
    },
    
    activated() {
      this.loadGraph();
    },

    mounted() {
      this.loadGraph();
    }
}
</script>