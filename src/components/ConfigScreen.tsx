import React, { useCallback, useState, useEffect } from 'react';
import { AppExtensionSDK } from '@contentful/app-sdk';
import {
  Form,
  Heading,
  Paragraph,
  TextField,
  Typography
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';

import { ReactComponent as CommerceLogo } from './logo.svg';

const styles = {
  body: css({
    height: 'auto',
    minHeight: '65vh',
    margin: '0 auto',
    marginTop: tokens.spacingXl,
    padding: `${tokens.spacingXl} ${tokens.spacing2Xl}`,
    maxWidth: tokens.contentWidthText,
    backgroundColor: tokens.colorWhite,
    zIndex: 2,
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '2px',
  }),
  background: (color: string) =>
    css({
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      top: 0,
      width: '100%',
      height: '300px',
      background: color,
    }),
  splitter: css({
    marginTop: tokens.spacingL,
    marginBottom: tokens.spacingL,
    border: 0,
    height: '1px',
    backgroundColor: tokens.gray300,
  }),
  icon: css({
    display: 'flex',
    justifyContent: 'center',
    '> svg': {
      display: 'block',
      width: '100px',
      margin: `${tokens.spacingXl} 0`,
      color: '#254E81',
    },
  }),
};

export interface AppInstallationParameters {
  publicKey: string,
}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

const Config = (props: ConfigProps) => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    publicKey: '',
  });

  const onConfigure = useCallback(async () => {
    const currentState = await props.sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, props.sdk]);

  useEffect(() => {
    props.sdk.app.onConfigure(() => onConfigure());
  }, [props.sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null = await props.sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      props.sdk.app.setReady();
    })()
  }, [props.sdk])

  return (
    <>
      <div className={styles.background('linear-gradient(85.06deg, #254E81 7.96%, #2C7EA1 92.04%)')} />
      <div className={styles.body}>
        <Typography>
          <Heading>About Commerce.js</Heading>
          <Paragraph>
            This app allows you to connect your content models with products from Commerce.js.
          </Paragraph>
          <hr className={styles.splitter} />
        </Typography>
        <Typography>
          <Heading>Configuration</Heading>
          <Form>
            <Paragraph>
              To configure this app, you will need to provide the <em>public key</em> from the Chec Dashboard. You can
              create a public key <a href="https://dashboard.chec.io/developer/api-keys" target="_blank" rel="noreferrer">
              here</a>.
            </Paragraph>
            <TextField
              id="public-key"
              name="publicKey"
              labelText="Public key"
              helpText="A Commerce.js public key (starts with 'pk_')"
              value={parameters.publicKey || ''}
              onChange={(event) => setParameters({
                publicKey: event.target.value,
              })}
              required
            />
          </Form>
        </Typography>
      </div>
      <div className={styles.icon}>
        <CommerceLogo />
      </div>
    </>
  );
}

export default Config;
