import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelMenu } from 'primeng/panelmenu';
import { DatePickerModule } from 'primeng/datepicker';

export const PRIME_AUTH_IMPORTS = [
  CardModule,
  InputTextModule,
  PasswordModule,
  ButtonModule,
  ToastModule,
  FloatLabelModule
];

export const PRIME_LAYOUT_IMPORTS = [
  ButtonModule,
  MenuModule,
  AvatarModule,
  PanelMenu
];

export const PRIME_VEHICLE_IMPORTS = [
  TableModule,
  DialogModule,
  InputNumberModule,
  ConfirmDialogModule,
  ButtonModule,
  InputTextModule,
  FloatLabelModule,
  ToastModule
];

export const PRIME_EXCHANGE_IMPORTS = [
  TableModule,
  DialogModule,
  InputNumberModule,
  ConfirmDialogModule,
  ButtonModule,
  InputTextModule,
  FloatLabelModule,
  ToastModule,
  DatePickerModule,
];