import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Grid, Paragraph, Spinner } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import Commerce from "@chec/commerce.js";
import { AppInstallationParameters } from "./ConfigScreen";
import { Product } from "@chec/commerce.js/types/product";
import { css } from "emotion";
import ProductOption from "./ProductOption";


interface DialogProps {
  sdk: DialogExtensionSDK;
}

interface DialogParameters {
  isMultiSelect: boolean;
  fieldValue: Array<string>;
}

const Dialog = (props: DialogProps) => {
  const { publicKey } = props.sdk.parameters.installation as AppInstallationParameters;
  const {
    isMultiSelect,
    fieldValue,
  } = props.sdk.parameters.invocation as DialogParameters;
  const [allProducts, setAllProducts] = useState<Array<Product>>([]);
  const [productCount, setProductCount] = useState<Number|undefined>();

  // The selection will be a single product IDs or an array of product IDs depending on whether the field is
  // multi-select or not
  const [selection, setSelection] = useState<Array<string>>(fieldValue);

  const commerceSdk = useMemo(() => {
    return new Commerce(publicKey, false, {
      axiosConfig: {
        headers: {
          'Chec-Version': '2021-10-06'
        },
      },
    });
  }, [publicKey]);

  useEffect(() => {
    if (!commerceSdk) {
      return;
    }

    commerceSdk.products.list({
      limit: 60, // A nice multiple of 3
    }).then(({ data: products, meta }) => {
      setAllProducts(products);
      setProductCount(meta.pagination.total);
    })
  }, [commerceSdk]);

  // No product count means that an API request hasn't been completed yet and we should show a spinner
  if (productCount === undefined) {
    return <div className={css({ height: '900px' })}>
      <Paragraph className={css({ margin: '80px', textAlign: 'center' })}>
        Fetching products <Spinner />
      </Paragraph>
    </div>
  }

  const chooseProduct = ({ id }: Product) => {
    if (!isMultiSelect) {
      setSelection([id]);
      return;
    }

    // Find if it's already selected and remove it
    const existingIndex = selection.findIndex((candidate) => candidate === id);
    if (existingIndex >= 0) {
      const copy = [...selection];
      copy.splice(existingIndex, 1);
      setSelection(copy);
      return;
    }

    setSelection([
      ...(Array.isArray(selection) ? selection : []),
      id,
    ]);
  }

  const onCancel = () => {
    props.sdk.close();
  }

  const onConfirm = () => {
    props.sdk.close(selection);
  }

  return <>
    <Grid
      columns={3}
      flow="row"
      columnGap="spacingXs"
      rowGap="spacingXs"
      className={css({ padding: '0.5rem 0.5rem 4rem', minHeight: '900px' })}
    >
      { allProducts.map((product) => (
        <ProductOption
          key={product.id}
          product={product}
          onSelect={() => chooseProduct(product)}
          selected={selection.includes(product.id)}
        />
      )) }
    </Grid>
    <Flex
      alignItems="center"
      justifyContent="end"
      className={css({
        background: 'white',
        position: 'fixed',
        width: 'calc(100% - 1rem)',
        bottom: 0,
        padding: '0.5rem',
      })}
    >
      <Button buttonType="muted" onClick={onCancel}>
        Cancel
      </Button>
      <Button className={css({ marginLeft: '0.5rem' })} onClick={onConfirm}>
        Confirm
      </Button>
    </Flex>
  </>;
};

export default Dialog;
