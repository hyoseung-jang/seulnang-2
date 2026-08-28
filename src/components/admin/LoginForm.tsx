"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/lib/admin-actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAdmin,
    null,
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input
        required
        autoFocus
        type="password"
        name="password"
        placeholder="관리자 비밀번호"
        className="w-full rounded-md border border-[#d8d8d8] bg-white px-4 py-3 text-[15px] outline-none focus:border-gold-deep"
      />
      {state ? (
        <p className="text-center text-sm text-[#e11d2e]">{state.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-ink py-3 text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {pending ? "확인 중..." : "로그인"}
      </button>
    </form>
  );
}
