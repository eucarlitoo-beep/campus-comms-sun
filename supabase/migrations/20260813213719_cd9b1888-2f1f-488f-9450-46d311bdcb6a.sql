REVOKE EXECUTE ON FUNCTION public.is_workspace_member(UUID, UUID) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_workspace_admin(UUID, UUID) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;