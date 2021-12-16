import React, { useEffect, useMemo, useState } from 'react';
import Commerce from '@chec/commerce.js';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import {
  Button,
  DropdownList,
  DropdownListItem,
  EntityList,
  EntityListItem,
  SkeletonBodyText,
  SkeletonContainer,
  SkeletonImage,
} from "@contentful/forma-36-react-components";
import { AppInstallationParameters } from "./ConfigScreen";
import { Product } from "@chec/commerce.js/types/product";
import { css } from "emotion";

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface InvalidProduct {
  id: string,
  invalid: true,
}

const Field = (props: FieldProps) => {
  const { publicKey } = props.sdk.parameters.installation as AppInstallationParameters;
  const { field: fieldSdk } = props.sdk;
  const isMultiSelect = fieldSdk.type === 'Array';
  const [fieldValue, setFieldValue] = useState<Array<string>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Array<Product|InvalidProduct>>([]);

  useEffect(() => {
    props.sdk.window.startAutoResizer();

    return () => props.sdk.window.stopAutoResizer();
  }, [props.sdk.window]);

  fieldSdk.onValueChanged((newValue) => {
    if (newValue === fieldValue || (newValue === undefined && fieldValue.length === 0)) {
      return;
    }

    if (!Array.isArray(newValue)) {
      if (!isMultiSelect && fieldValue[0] === newValue) {
        return;
      }

      if (!newValue) {
        setFieldValue([]);
        return;
      }

      setFieldValue([newValue]);
      return;
    }

    setFieldValue(newValue);
  });

  const handleButtonClick = async () => {
    const result = await props.sdk.dialogs.openCurrentApp({
      allowHeightOverflow: true,
      parameters: { isMultiSelect, fieldValue },
      position: 'center',
      title: isMultiSelect ? 'Select products' : 'Select a product',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      minHeight: 'max(500px, 80vh)',
      width: 1000,
    });

    if (!Array.isArray(result)) {
      return;
    }

    return fieldSdk.setValue(isMultiSelect ? result : result[0]);
  }

  const handleDeleteProduct = (id: string) => {
    const index = fieldValue.findIndex(candidate => candidate === id);
    if (index < 0) {
      return;
    }

    fieldSdk.setValue(isMultiSelect
      ? [
        ...fieldValue.slice(0, index),
        ...fieldValue.slice(index + 1),
      ]
      : undefined,
    );
  }

  const commerceSdk = useMemo(() => {
    return new Commerce(publicKey, false);
  }, [publicKey]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (fieldValue.length === 0 || !commerceSdk) {
      setProducts([]);
      return;
    }

    // Skip loading if we already have all the relevant products
    if (fieldValue.every(id => products.find(candidate => candidate.id === id))) {
      // Just filter out products that aren't in the field value
      setProducts(products.filter(candidate => fieldValue.includes(candidate.id)));
      return;
    }

    setLoading(true);

    if (fieldValue.length === 1) {
      const id = fieldValue[0];
      commerceSdk.products.retrieve(id).then((product) => {
        setProducts([product]);
      }).catch(() => {
        setProducts([{
          id,
          invalid: true,
        }]);
      }).finally(() => {
        setLoading(false);
      })
      return;
    }

    commerceSdk.products.list({
      query: fieldValue.join(','),
      limit: 200, // Technically won't support a contentful field with more than 200 products.
    }).then(({ data: products }) => {
      // Find products that weren't fetched (i.e. they were deleted) and fill in blanks
      setProducts(fieldValue.reduce<Array<Product|InvalidProduct>>((acc, id) => ([
        ...acc,
        (products || []).find(candidate => candidate.id === id) || {
          id,
          invalid: true,
        }
      ]), []));
      setLoading(false);
    })
    // eslint-disable-next-line
  }, [commerceSdk, fieldValue, isMultiSelect]);

  const renderDropdownOptions = ({ id }: Product) => (
    <DropdownList>
      <DropdownListItem
        onClick={() => {
          const page = window.open(`https://dashboard.chec.io/products/${id}`, '_blank');
          if (page) {
            page.focus();
          }
        }}
      >
        Open in Chec Dashboard
      </DropdownListItem>
      <DropdownListItem onClick={() => handleDeleteProduct(id)}>
        Delete
      </DropdownListItem>
    </DropdownList>
  )

  return (
    <>
      { loading && (
        <div className={css({ position: 'relative', maxHeight: '50px' })}>
          <SkeletonContainer>
            <SkeletonImage height={50} width={50} />
            <SkeletonBodyText offsetLeft={55} />
          </SkeletonContainer>
        </div>
      ) }
      { !loading && Boolean(products.length) && (<EntityList>
        { products.map(product => (
          'invalid' in product
            ? <EntityListItem
              key={product.id}
              title="Deleted product"
              contentType={product.id}
              dropdownListElements={(
                <DropdownListItem onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </DropdownListItem>
              )}
            />
            : <EntityListItem
              key={product.id}
              title={product.name}
              thumbnailUrl={product.image ? product.image.url : undefined}
              dropdownListElements={renderDropdownOptions(product)}
            />
        ))}
      </EntityList>) }
      <Button onClick={handleButtonClick} className={css({ marginTop: '.5rem' })} buttonType="muted">
        { isMultiSelect ? 'Select products' : 'Select a product' }
      </Button>
    </>
  );
};

export default Field;
