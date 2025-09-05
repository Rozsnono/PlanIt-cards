export class ModalClass {

    public FilterModal({ className, children }: { className?: string, children: React.ReactNode }) {
        return (
            <div className={`absolute z-50 more-modal ` + className}>
                <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex flex-col gap-4 text-sm">
                        {children}
                    </div>
                </div>
            </div>
        )
    }

    public SettingsModal({ className, children }: { className?: string, children: React.ReactNode }) {
        return (
            <div className={`absolute z-50 more-modal ` + className}>
                <div className="bg-zinc-800 rounded-lg p-2">
                    <div className="flex flex-col gap-2 text-sm">
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}