import { useController, UseControllerProps } from "react-hook-form";
import { Label } from "../ui/label";
import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";

type Props = {
  label: string;
  showlabel?: boolean;
} & UseControllerProps;
export default function TextAreaForm(props: Props) {
  const { field, fieldState } = useController({ ...props });
  return (
    <div className="mb-3 block w-full">
      {props.showlabel && (
        <div className="my-3">
          <Label htmlFor={field.name}>{props.label}</Label>
        </div>
      )}
      <Textarea
        {...props}
        {...field}
        value={field.value || ""}
        placeholder={props.label}
        color={
          fieldState?.error ? "failure" : !fieldState.isDirty ? "" : "success"
        }
      />
      {fieldState.error && (
        <Alert variant={"destructive"}>
          <AlertCircleIcon />
          <AlertTitle>{fieldState.error.message}</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
