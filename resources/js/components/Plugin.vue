<template>
    <div class="w-full overflow-scroll">
      <div v-html="output"></div>

      <div
          v-show="loading"
          class="z-10 fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
      >
          <transition
              enter-class="opacity-0"
              enter-active-class="ease-out duration-300"
              enter-to-class="opacity-100"
              leave-class="opacity-100"
              leave-active-class="ease-in duration-200"
              leave-to-class="opacity-0"
          >
              <div>
                  <div v-show="loading" class="fixed inset-0 transition-opacity">
                      <div class="absolute inset-0 bg-black opacity-75"></div>
                  </div>

                  <transition
                      enter-active-class="ease-out duration-300"
                      enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                      leave-active-class="ease-in duration-200"
                      leave-class="opacity-100 translate-y-0 sm:scale-100"
                      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                      <div
                          v-if="loading"
                          class="ml-14 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all"
                      >
                          <div class="bg-white px-8 py-4">
                              <div class="flex justify-center items-center">
                                  <svg
                                      class="h-8 w-8"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 40 40"
                                  >
                                      <path
                                          class="text-cool-gray-300"
                                          fill="currentColor"
                                          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
                                      />
                                      <path
                                          class="text-cool-gray-500"
                                          fill="currentColor"
                                          d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z"
                                      >
                                          <animateTransform
                                              attributeType="xml"
                                              attributeName="transform"
                                              type="rotate"
                                              from="0 20 20"
                                              to="360 20 20"
                                              dur="1s"
                                              repeatCount="indefinite"
                                          />
                                      </path>
                                  </svg>

                                  <span class="ml-2 leading-5 text-cool-gray-700">
                                      Loading model definitions ({{ progress}}/{{ total }})
                                  </span> ...
                              </div>
                          </div>
                      </div>
                  </transition>
              </div>
          </transition>
      </div>
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
        progress: 0,
        total: 0,
        loading: false,
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
          
          let modelDefinitions = [];
          
          this.loading = true;
          this.progress = 0;
          this.total = modelClasses.length;

          for (const model of modelClasses) {
            try {
              modelDefinitions.push(await invoker.getModelDefinition({ model }));
            } catch (e) {
              //
            }
            this.progress++;
          }

          this.loading = false;

          modelDefinitions
          .filter(result => {
            return typeof result === 'object';
          }).forEach(definition => {
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
                  maxZoom: 20,
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