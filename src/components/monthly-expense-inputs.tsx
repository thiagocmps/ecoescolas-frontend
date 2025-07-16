import React, { useImperativeHandle, useState, forwardRef } from "react";
import { View, Text, Platform, Pressable } from "react-native";
import CustomTextInput from "./input/input";

export type MonthlyExpense = {
  water: string;
  light: string;
  gas: string;
  date: string;
};

export type MonthlyExpenseInputsRef = {
  getValues: () => MonthlyExpense /* & { date: Date } */;
};

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const getYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  return [currentYear, currentYear + 1, currentYear + 2];
};

const MonthlyExpenseInputs = forwardRef<MonthlyExpenseInputsRef>((_, ref) => {
  const [inputs, setInputs] = useState<MonthlyExpense>({
    water: "",
    light: "",
    gas: "",
    date: "",
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  useImperativeHandle(ref, () => ({
  getValues: () => {
    const monthIndex = months.indexOf(selectedMonth) + 1; // meses são 1-12 na string
    const paddedMonth = String(monthIndex).padStart(2, "0"); 
    const isoDate = `${selectedYear}-${paddedMonth}-15T12:00:00.000Z`;

    return {
      ...inputs,
      date: isoDate, // <-- string fixa sem chance de fuso
    };
  },
}));


  const years = getYears();

  const dropdownStyle = {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  };

  return (
    <View style={{ gap: 8 }}>
      {/* Mês */}
      <View>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          🗓️ Mês da atividade:
        </Text>
        {Platform.OS === "web" ? (
          <select
            title="Selecione o mês"
            aria-label="Selecione o mês"
            style={dropdownStyle}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        ) : (
          <View style={dropdownStyle}>
            {months.map((month) => (
              <Pressable key={month} onPress={() => setSelectedMonth(month)}>
                <Text
                  style={{
                    paddingVertical: 4,
                    fontWeight: month === selectedMonth ? "bold" : "normal",
                    color: month === selectedMonth ? "#007AFF" : "#000",
                  }}
                >
                  {month}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          📅 Ano da atividade:
        </Text>
        {Platform.OS === "web" ? (
          <select
            title="Selecione o ano"
            aria-label="Selecione o ano"
            style={dropdownStyle}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        ) : (
          <View style={dropdownStyle}>
            {years.map((year) => (
              <Pressable key={year} onPress={() => setSelectedYear(year)}>
                <Text
                  style={{
                    paddingVertical: 4,
                    fontWeight: year === selectedYear ? "bold" : "normal",
                    color: year === selectedYear ? "#007AFF" : "#000",
                  }}
                >
                  {year}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <CustomTextInput
        type="input"
        placeholder="Adicione aqui o gasto de água"
        onChangeText={(text) => setInputs((prev) => ({ ...prev, water: text }))}
        value={inputs.water}
        label="💧Gasto de água:"
        subLabel="(adicione aqui o gasto conforme a demanda da atividade)"
      />
      <CustomTextInput
        type="input"
        placeholder="Adicione aqui o gasto de luz"
        onChangeText={(text) => setInputs((prev) => ({ ...prev, light: text }))}
        value={inputs.light}
        label="💡Gasto de luz:"
        subLabel="(adicione aqui o gasto conforme a demanda da atividade)"
      />
      <CustomTextInput
        type="input"
        placeholder="Adicione aqui o gasto de gás"
        onChangeText={(text) => setInputs((prev) => ({ ...prev, gas: text }))}
        value={inputs.gas}
        label="☁️⚡🔥🌫️💨 Gasto de gás:"
        subLabel="(adicione aqui o gasto conforme a demanda da atividade)"
      />
    </View>
  );
});

export default MonthlyExpenseInputs;
