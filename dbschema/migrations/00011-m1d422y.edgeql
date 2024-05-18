CREATE MIGRATION m1d422yp5yupl4tx4afhjzscwvz3zhegxnvgf2yiuu42rchejlacsa
    ONTO m1svffvxkfai4vm7jqojssj6jhhd6srjqfdrku3u7s724ckfy7hdgq
{
  ALTER GLOBAL default::current_user USING (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
};
