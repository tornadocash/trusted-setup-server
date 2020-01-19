create table contributions
(
    id int auto_increment,
    name varchar(255) not null,
    company varchar(255) not null,
    hash varchar(130) not null,

    constraint contributions_pk
        primary key (id)
);

create unique index contributions_hash_uindex
    on contributions (hash);
