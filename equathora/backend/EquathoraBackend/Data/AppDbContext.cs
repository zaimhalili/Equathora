using Microsoft.EntityFrameworkCore;
using EquathoraBackend.Models;

namespace EquathoraBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Problem> Problems => Set<Problem>();
        public DbSet<Attempt> Attempts => Set<Attempt>();
        public DbSet<UserStats> UserStats => Set<UserStats>();

    }
}