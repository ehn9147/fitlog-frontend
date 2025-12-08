import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { WorkoutStats } from "./WorkoutStats";

interface ProgressReportDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ProgressReportDialog({
  open,
  onClose,
}: ProgressReportDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        
        className="
          w-[95vw]
          sm:max-w-4xl
          bg-white
          rounded-none
          border-[6px] border-black
          p-0
        "
      >
    
        <div className="max-h-[80vh] overflow-y-auto px-6 pt-6 pb-20 space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="uppercase tracking-wide font-mono text-lg">
              Progress report
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-muted-foreground">
              Compare your training across days, weeks, months, and years.
            </DialogDescription>
          </DialogHeader>

          <WorkoutStats />
        </div>
      </DialogContent>
    </Dialog>
  );
}
