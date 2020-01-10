<template>
  <div>
    <v-row v-if="getUserName != null">
      <v-col>
        <v-alert>
          <v-avatar class="profile" color="grey" size="64">
            <v-img :src="getUserPhoto"></v-img>
          </v-avatar>
          {{ getUserName }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Custo /km"
          placeholder="Valor"
          outlined
          suffix="€"
          v-model="custoporkm"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="Remuneração extra"
          placeholder="Valor"
          outlined
          suffix="€"
          v-model="remuneracao"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          :value="kmparapercorrer"
          label="Kilometros para percorrer"
          placeholder="Valor"
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-date-picker
          v-model="month"
          :landscape="true"
          full-width
          type="month"
          min="2017-06"
          :max="new Date().toISOString().substr(0, 7)"
          locale="pt-pt"
        ></v-date-picker>
      </v-col>
      <v-col>
        <v-btn class="ma-2" outlined @click="calcularDistancias">Calcular</v-btn>
      </v-col>
    </v-row>
    <div v-if="tripFinal != null">
      <v-row>
        <v-col>
          <v-btn class="ma-2" outlined @click="exporta">Exportar</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="fields"
            :items="tripFinal"
            :items-per-page="15"
            :sort-by="'dateRaw'"
            :sort-desc="false"
            class="elevation-1"
          >
            <template v-slot:item.date="{ item }">
              <v-chip>{{ item.date | mom }}</v-chip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <h3>TODO: Colocar loading bar</h3>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapActions } from "vuex";
import { ExportToCsv } from "export-to-csv";
import moment from "moment";

export default {
  name: "home",
  data: () => ({
    month: new Date().toISOString().substr(0, 7),
    custoporkm: 0.36,
    remuneracao: null,
    tripFinal: null,
    fields: [
      {
        text: "Nome",
        align: "left",
        value: "name",
        sortable: false
      },
      {
        text: "Distância",
        align: "left",
        value: "dist",
        sortable: false
      },
      {
        text: "Data",
        align: "right",
        value: "date",
        sortable: false
      }
    ]
  }),
  filters: {
    mom: function(date) {
      return date.format("dddd, D MMMM YYYY");
      //"dddd, MMMM Do YYYY"
    }
  },
  computed: {
    ...mapGetters(["getAllPlaces", "getUserName", "getUserPhoto"]),
    kmparapercorrer() {
      if (this.custoporkm <= 0) {
        return 0;
      }
      return Math.ceil(this.remuneracao / this.custoporkm);
    }
  },
  methods: {
    ...mapActions(["loadAllPlaces"]),
    calcularDistancias() {
      let targetDist = this.kmparapercorrer;
      let arrayPlaces = this.getAllPlaces.sort(() => Math.random() - 0.5);
      let trip = [];
      let i = 0;
      let nDiasNoMes = moment(this.month, "YYYY-MM").daysInMonth();
      let inicioDoMes = moment(this.month, "YYYY-MM");
      let diasDisponiveis = [];
      // let diasDasTrips = [];
      // let mes = moment(this.month)
      //   .toDate()
      //   .toString()
      //   .substr(4, 3);
      for (let i = 1; i <= nDiasNoMes; i++) {
        let dia = moment(this.month)
          .date(i)
          .toDate()
          .toString()
          .substr(0, 3);
        let mes = moment(this.month)
          .date(i)
          .toDate()
          .toString()
          .substr(4, 3);
        console.log(mes);
        if (dia !== "Sat" && dia !== "Sun") {
          diasDisponiveis.push(
            moment(inicioDoMes)
              .date(i)
              .toDate()
          );
        }
      }

      // console.log(diasDisponiveis.length);
      // diasDisponiveis.forEach(d => {
      //   console.log(d);
      // });

      while (targetDist >= 0) {
        let tempRng = Math.round(Math.random() * (arrayPlaces.length - 1));
        targetDist -= arrayPlaces[tempRng].dist;
        let { name, dist } = arrayPlaces[tempRng];
        let tempDiaRng = Math.round(
          Math.random() * (diasDisponiveis.length - 1)
        );
        // diasDasTrips.push(
        //   diasDisponiveis.splice(tempDiaRng, 1)
        // )
        let tempDia = diasDisponiveis.splice(tempDiaRng, 1)[0];
        let dateRaw = moment(tempDia)
          .toISOString()
          .substr(0, 10);

        // console.log(tempDia);
        console.log(moment(tempDia).format("dddd, MMMM Do YYYY"));

        trip.push({
          id: i++,
          name,
          dist,
          dateRaw,
          date: moment(tempDia)
        });
      }
      this.tripFinal = trip;
    },
    exporta() {
      const options = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        showTitle: true,
        title: "O Papa kilometros",
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      };

      const csvExporter = new ExportToCsv(options);
      let finalT = [];
      this.tripFinal.forEach(t => {
        let tempT = {
          name: t.name,
          dist: t.dist,
          date: moment(t.date).format("YYYY-MM-DD")
        };
        finalT.push(tempT);
      });

      csvExporter.generateCsv(
        finalT.sort((a, p) => (a.date > p.date ? 1 : -1))
      );
    }
  }
};
</script>
