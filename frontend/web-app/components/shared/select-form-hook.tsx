import { useController, UseControllerProps } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  placeholder: string;
  showlabel?: boolean;
  data: Option[];
} & UseControllerProps;

export default function SelectForm(props: Props) {
  const { field, fieldState } = useController({ ...props });

  return (
    <div className="mb-3 block w-full">
      {props.showlabel && (
        <div className="my-3">
          <Label htmlFor={field.name}>{props.label}</Label>
        </div>
      )}
      <Select onValueChange={field.onChange} value={field.value || ""}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {props.data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldState.error && (
        <Alert variant={"destructive"}>
          <AlertCircleIcon />
          <AlertTitle>{fieldState.error.message}</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
