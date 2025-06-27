import { DropdownOption } from "../components/dropdown-select/dropdown-select"; // ajuste o caminho
import { salasPorBloco } from "../navigation/screens/add-report-page"; // ajuste conforme necessário
import { optionsBloco } from "../navigation/screens/add-report-page"; // onde você definiu os blocos

interface LabelBlocoResult {
  label: string;
  bloco: string;
}

export function getLabelAndBlocoFromValue(value: string): LabelBlocoResult | null {
  for (const blocoKey in salasPorBloco) {
    const sala = salasPorBloco[blocoKey].find((option: DropdownOption) => option.value === value);
    if (sala) {
      const blocoLabel = optionsBloco.find((b) => b.value === blocoKey)?.label ?? blocoKey;
      return {
        label: sala.label,
        bloco: blocoLabel,
      };
    }
  }
  return null;
}
