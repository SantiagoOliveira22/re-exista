import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ProfessionalForm from "./components/form";

const ProfessionalFormPage = () => {
  return (
    <div>
      <Dialog open>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Adicionar Profissional</DialogTitle>
            <DialogDescription>
              Preencha as informações do profissional para continuar.
            </DialogDescription>
          </DialogHeader>
          <ProfessionalForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalFormPage;
