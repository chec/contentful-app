import { Product } from "@chec/commerce.js/types/product";
import { Card, Checkbox, Flex, Paragraph } from '@contentful/forma-36-react-components';
import {KeyboardEvent, MouseEvent} from "react";
import {css} from "emotion";

interface ProductOptionProps {
  product: Product;
  selected?: boolean,
  onSelect: (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void,
}

const ProductOption = ({ onSelect, product, selected }: ProductOptionProps) => {
  return <Card selected={selected} onClick={onSelect}>
    <div className={css({
      display: 'flex',
      aspectRatio: '1.2/1',
      alignItems: 'center',
      justifyContent: 'center',
      /* @ts-ignore */
      background: `url(${product.image && product.image.url}) #eee`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      margin: 'calc(-1rem + 2px) calc(-1rem + 2px) 0', // Weird calcs here support the card's "selected" style
      width: 'calc(100% + 2rem - 4px)',
    })}>
      { /* @ts-ignore */ }
      { !product.image && (
        <Paragraph className={css({
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          fontSize: '0.75rem',
          color: 'gray',
        })}>
          No image
        </Paragraph>
      ) }
    </div>
    <Flex alignItems="center" className={css({ marginTop: '1rem' })}>
      <Checkbox checked={selected} labelText={''} className={css({ marginRight: '.5em' })} />
      <Paragraph>{ product.name }</Paragraph>
    </Flex>
  </Card>
};

export default ProductOption;
