'use server'
import { createClient } from '../../utils/supabase/server'

export async function login(formData: { email: string; password: string }) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  }

  const result = await supabase.auth.signInWithPassword(data)

  return JSON.stringify(result)
}

// export async function signup(formData: FormData) {
//   const supabase = createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signUp(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/tenants', 'layout')
//   redirect('/tenants')
// }
