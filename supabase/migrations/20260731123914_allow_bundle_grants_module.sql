alter table products drop constraint if exists products_grants_module_check;

alter table products
    add constraint products_grants_module_check
    check (grants_module in ('nutrition', 'training', 'all'));
