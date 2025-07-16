import React, { useImperativeHandle, useState, forwardRef } from "react";
import { View } from "react-native";
import CustomTextInput from "./input/input";

export type MonthlyExpense = {
  water: string;
  light: string;
  gas: string;
};  

export type MonthlyExpenseInputsRef = {
  getValues: () => MonthlyExpense;
};

const MonthlyExpenseInputs = forwardRef<MonthlyExpenseInputsRef>((_, ref) => {
  const [inputs, setInputs] = useState<MonthlyExpense>({
    water: "",
    light: "",
    gas: "",
  });

  // Expor valores para o componente pai
  useImperativeHandle(ref, () => ({
    getValues: () => inputs,
  }));

  return (
    <View style={{ gap: 8 }}>
      <CustomTextInput
        type="input"
        placeholder="Adicione aqui o gasto de água"
        onChangeText={(text) =>
          setInputs((prev) => ({ ...prev, water: text }))
        }
        value={inputs.water}
        label="💧Gasto de água:"
        subLabel="(adicione aqui o gasto conforme a demanda da atividade)"
      />
      <CustomTextInput
        type="input"
        placeholder="Adicione aqui o gasto de luz"
        onChangeText={(text) =>
          setInputs((prev) => ({ ...prev, light: text }))
        }
        value={inputs.light}
        label="💡Gasto de luz:"
        subLabel="(adicione aqui o gasto conforme a demanda da atividade)"
      />
      <CustomTextInput
        type="input"
        placeholder="Adicione aqui o gasto de gás"
        onChangeText={(text) =>
          setInputs((prev) => ({ ...prev, gas: text }))
        }
        value={inputs.gas}
        label="☁️⚡🔥🌫️💨 Gasto de gás:"
        subLabel="(adicione aqui o gasto conforme a demanda da atividade)"
      />
    </View>
  );
});

export default MonthlyExpenseInputs;
