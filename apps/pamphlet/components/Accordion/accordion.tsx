import { ComponentProps, FC, HtmlHTMLAttributes, ReactNode } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import styles from './accordion.module.scss';
import React from 'react';
import classNames from 'classnames';
import Image from 'next/image';
// import { Icon } from '@components/Icon/icon';

type AccordionRootProps = ComponentProps<typeof Accordion.Root> & {
  width?: string | number;
};

const AccordionRoot: FC<AccordionRootProps> = (props) => {
  const singleProps = props as Accordion.AccordionImplSingleProps;
  const multiProps = props as Accordion.AccordionImplMultipleProps;

  return props.type === 'single' ? (
    <Accordion.Root
      className={classNames(styles.accordion)}
      {...singleProps}
      type='single'
      style={{ width: props.width }}
    >
      {singleProps.children}
    </Accordion.Root>
  ) : (
    <Accordion.Root
      className={classNames(styles.accordion)}
      {...multiProps}
      type='multiple'
      style={{ width: props.width }}
    >
      {multiProps.children}
    </Accordion.Root>
  );
};

const AccordionItem: FC<{ title: string; children: ReactNode; value: string }> = ({
  title,
  value,
  children,
}) => {
  return (
    <Accordion.Item className={styles['accordion-item']} value={value}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <Accordion.Content className={styles['accordion-content']}>
        <div className={styles['accordion-content-text']}>{children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className={styles['accordion-header']}>
    <Accordion.Trigger
      className={classNames(styles['accordion-trigger'], className)}
      {...props}
      ref={forwardedRef}
    >
      <span>{children}</span>
      <Image
        src={'/icon-arrow-down.svg'}
        alt={'icon'}
        width={24}
        height={24}
        className={styles.icon}
      />
    </Accordion.Trigger>
  </Accordion.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames(styles.AccordionContent, className)}
      {...props}
      ref={forwardedRef}
    >
      <div className={styles.AccordionContentText}>{children}</div>
    </Accordion.Content>
  )
);

AccordionContent.displayName = 'AccordionContent';

export { AccordionRoot, AccordionItem };
