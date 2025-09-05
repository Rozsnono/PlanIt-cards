"use client";

export default function VerifyPage() {

    return (
        <main className="w-full rounded-md p-3 min-h-screen text-zinc-200 relative gap-2">
            <div className="flex justify-between items-center pb-1">
                <div className="text-xl p-2 flex gap-2 items-center">
                    Email verification
                </div>
            </div>
            <hr />
            <div className={`w-full flex flex-col gap-10 grid-cols-4 justify-center items-center h-full pt-16`}>
                <div className="flex flex-col justify-center text-center gap-2">
                    <h1 className="text-4xl">Verify your account</h1>
                    <p className="text-lg">Please check your email and follow the instructions to verify your account.</p>
                </div>
            </div>
        </main>
    );
}