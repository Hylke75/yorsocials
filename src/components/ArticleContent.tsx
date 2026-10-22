import Link from 'next/link';
import type { InlineNode, RichTextBlock } from '@/content/types';
import { MediaImage } from './MediaImage';
import styles from './ArticleContent.module.css';

function Inline({ node }: { node: InlineNode }) {
  if (typeof node === 'string') return <>{node}</>;
  const external = /^https?:\/\//.test(node.href);
  return external ? (
    <a href={node.href} target="_blank" rel="noopener noreferrer">
      {node.text}
      <span className="visually-hidden"> (opent in nieuw venster)</span>
    </a>
  ) : (
    <Link href={node.href}>{node.text}</Link>
  );
}

/** Rendert rich text als semantische HTML (koppen, lijsten, figuren met caption, citaten). */
export function ArticleContent({ blocks }: { blocks: RichTextBlock[] }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={i}>
                {block.content.map((n, j) => (
                  <Inline key={j} node={n} />
                ))}
              </p>
            );
          case 'heading':
            return block.level === 2 ? <h2 key={i}>{block.text}</h2> : <h3 key={i}>{block.text}</h3>;
          case 'list': {
            const List = block.ordered ? 'ol' : 'ul';
            return (
              <List key={i}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </List>
            );
          }
          case 'image':
            return <MediaImage key={i} asset={block.image} sizes="(max-width: 800px) 100vw, 760px" showCaption className={styles.figure} />;
          case 'quote':
            return (
              <blockquote key={i}>
                <p style={{ margin: 0 }}>{block.text}</p>
                {block.cite && <cite>{block.cite}</cite>}
              </blockquote>
            );
        }
      })}
    </div>
  );
}
