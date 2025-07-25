# DrishiQ

A Next.js application with user authentication and profile management.

## Features

- Multi-language support (English, Hindi, Telugu, Tamil, Kannada)
- User authentication with Supabase
  - Social login (Google, Facebook, LinkedIn)
  - Email + Password authentication
  - Phone number verification
- User onboarding flow
  - Language selection
  - Introduction videos
  - Profile completion
- Modern UI with Tailwind CSS
- Protected routes with middleware
- TypeScript support

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Supabase account and project

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/drishiq.git
cd drishiq
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### User Table

```sql
create table public.User (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  first_name text,
  last_name text,
  date_of_birth date,
  phone text,
  city text,
  country text,
  occupation text,
  is_profile_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.User enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.User for select
  using ( auth.uid() = user_id );

create policy "Users can update own profile"
  on public.User for update
  using ( auth.uid() = user_id );

create policy "Users can insert own profile"
  on public.User for insert
  with check ( auth.uid() = user_id );
```

## Project Structure

```
drishiq/
├── app/                    # Next.js app directory
│   ├── create-password/    # Create password page
│   ├── dashboard/         # Dashboard page
│   ├── profile/          # Profile page
│   ├── signin/          # Sign in page
│   ├── signup/         # Sign up page
│   ├── verify-phone/  # Phone verification page
│   ├── video-experience/ # Video experience page
│   └── page.tsx        # Landing page
├── components/         # React components
├── lib/               # Utility functions and configurations
│   ├── flow-controller.ts  # User flow management
│   ├── language-context.tsx # Language context provider
│   └── supabase.ts    # Supabase client configuration
├── middleware.ts      # Authentication middleware
├── public/           # Static assets
└── package.json      # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
