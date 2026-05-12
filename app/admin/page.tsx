import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('nome', { ascending: true })

  async function createUser(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const nome = formData.get('nome') as string
    const senha = formData.get('senha') as string
    await supabase.from('users').insert({ nome, senha })
    redirect('/admin')
  }

  async function deleteUser(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const nome = formData.get('nome') as string
    await supabase.from('users').delete().eq('nome', nome)
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Gerenciamento de Usuários</h1>
          <a href="/todos" className="text-sm text-muted-foreground hover:underline">
            Voltar ao App
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        
        {/* Criar usuário */}
        <div className="border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Criar Usuário</h2>
          <form action={createUser} className="flex flex-col gap-3">
            <input
              name="nome"
              placeholder="Nome"
              required
              className="border rounded px-3 py-2 bg-background"
            />
            <input
              name="senha"
              type="password"
              placeholder="Senha"
              required
              className="border rounded px-3 py-2 bg-background"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground rounded px-4 py-2 hover:opacity-90"
            >
              Criar
            </button>
          </form>
        </div>

        {/* Lista de usuários */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Usuários Cadastrados</h2>
          {error && <p className="text-red-500 mb-4">Erro ao carregar usuários</p>}
          <ul className="flex flex-col gap-3">
            {users?.map((u) => (
              <li key={u.nome} className="flex items-center justify-between border rounded px-4 py-3">
                <span className="font-medium">{u.nome}</span>
                <form action={deleteUser}>
                  <input type="hidden" name="nome" value={u.nome} />
                  <button
                    type="submit"
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remover
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>

      </main>
    </div>
  )
}
