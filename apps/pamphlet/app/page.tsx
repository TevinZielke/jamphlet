import Link from 'next/link';
import supabase from '../utils/supabase';

import { Container } from '@/components/Container/container';

export const revalidate = 0;

export default async function Posts() {
  const { data, error } = await supabase.from('Customers').select('*');
  // const { data } = await supabase.from('Customers').select('id, name')

  if (!data) {
    return <p>No posts found!</p>;
  }

  return (
    <Container>
      {data.map((post: any) => (
        <p key={post.id}>
          <Link href={`/${post.hash}`}>{post.name}</Link>
        </p>
      ))}
    </Container>
  );
}
