import React, { useCallback, useState, useEffect } from 'react';
import { AppExtensionSDK } from '@contentful/app-sdk';
import {
  Card,
  Form,
  Heading,
  Paragraph,
  TextField,
  Workbench
} from '@contentful/forma-36-react-components';
import { css } from 'emotion';

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
    <Workbench className={css({ margin: '80px' })}>
      <Card className={css({ margin: '0px auto' })}>
        <Form>
          <Heading>Commerce.js configuration</Heading>
          <Paragraph>
            This app allows you to connect your content models with products from Commerce.js.
          </Paragraph>
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
      </Card>
    </Workbench>
  );
}

export default Config;
