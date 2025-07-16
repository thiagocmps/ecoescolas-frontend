import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

type MonthlyRecord = {
  date: string; // ex: "2023-08-01"
  water: number;
  light: number;
  gas: number;
};

type MonthlyConsumption = MonthlyRecord & {
  consumoWater: number | null;
  consumoLight: number | null;
  consumoGas: number | null;
};

type Props = {
  registros: MonthlyRecord[];
};

export default function ConsumptionList({ registros }: Props) {
  // Ordena os registros pela data (do mais antigo ao mais recente)
  const registrosOrdenados = [...registros].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calcula o consumo mensal (diferença dos valores)
  const consumos: MonthlyConsumption[] = registrosOrdenados.map(
    (registro, index) => {
      if (index === 0) {
        return {
          ...registro,
          consumoWater: null,
          consumoLight: null,
          consumoGas: null,
        };
      }
      const anterior = registrosOrdenados[index - 1];
      return {
        ...registro,
        consumoWater: registro.water - anterior.water,
        consumoLight: registro.light - anterior.light,
        consumoGas: registro.gas - anterior.gas,
      };
    }
  );

  // Função para formatar data em "Mês/Ano" (ex: Agosto/2023)
  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleString("pt-PT", { month: "long", year: "numeric" });
  };

  return (
    <FlatList
      data={consumos}
      keyExtractor={(item) => item.date}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{formatDate(item.date)}</Text>
          <Text>
            💧 Água: {item.water} m³{" "}
            {item.consumoWater !== null && `(Consumo: ${item.consumoWater})`}
          </Text>
          <Text>
            💡 Luz: {item.light} kWh{" "}
            {item.consumoLight !== null && `(Consumo: ${item.consumoLight})`}
          </Text>
          <Text>
            ☁️ Gás: {item.gas} m³{" "}
            {item.consumoGas !== null && `(Consumo: ${item.consumoGas})`}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Nenhum registro encontrado.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
});
